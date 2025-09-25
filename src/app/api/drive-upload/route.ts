import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";

// Use the Node runtime so we can stream to Drive
export const runtime = "nodejs";

// Convert WHATWG ReadableStream -> Node Readable, without ts-expect-error
function toNodeStream(webStream: ReadableStream<Uint8Array>): NodeJS.ReadableStream {
  type ReadableWithFromWeb = typeof Readable & {
    fromWeb?: (stream: ReadableStream<Uint8Array>) => NodeJS.ReadableStream;
  };
  const R = Readable as ReadableWithFromWeb;

  if (typeof R.fromWeb === "function") {
    return R.fromWeb(webStream);
  }

  // Fallback for environments missing Readable.fromWeb
  const reader = webStream.getReader();
  const node = new Readable({
    read() {
      reader
        .read()
        .then(({ done, value }) => {
          if (done) {
            this.push(null);
          } else {
            this.push(Buffer.from(value));
          }
        })
        .catch((err) => this.destroy(err));
    },
  });
  return node;
}

function bytesToMB(bytes: number) {
  return (bytes / 1048576).toFixed(2) + " MB";
}

function isoToPSTString(iso?: string) {
  const date = iso ? new Date(iso) : new Date();
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    dateStyle: "medium",
    timeStyle: "short",
  });
  return fmt.format(date);
}

function getErrorMessage(e: unknown): string {
  if (e instanceof Error && e.message) return e.message;
  if (typeof e === "string") return e;
  return "Upload failed";
}

type GoogleApiErrorLike = {
  response?: { data?: unknown };
};

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const name = (form.get("name") as string) || file.name || "upload.mp4";
    const whenISO = (form.get("whenISO") as string) || undefined;
    const wallet = (form.get("wallet") as string) || "";
    const tx = (form.get("tx") as string) || "";

    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
    const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!;
    const parent = process.env.DRIVE_PARENT_FOLDER_ID!;

    if (!email || !key || !parent) {
      return NextResponse.json({ error: "Drive env vars not set" }, { status: 500 });
    }

    const auth = new google.auth.JWT({
      email,
      key: key.replace(/\\n/g, "\n"),
      scopes: [
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const drive = google.drive({ version: "v3", auth });

    // Optional metadata in the Drive file description
    const description = JSON.stringify(
      { whenISO, wallet, tx, uploadedAt: new Date().toISOString() },
      null,
      2
    );

    // 1) Upload MP4 to Drive (Shared Drive folder)
    const created = await drive.files.create({
      requestBody: {
        name,
        parents: [parent],
        mimeType: file.type || "video/mp4",
        description,
      },
      media: {
        mimeType: file.type || "video/mp4",
        body: toNodeStream(file.stream()),
      },
      fields: "id, name, mimeType, webViewLink, webContentLink",
      supportsAllDrives: true,
    });

    // 2) Append a row to the Google Sheet
    const spreadsheetId = process.env.SHEETS_SPREADSHEET_ID;
    const range = process.env.SHEETS_RANGE || "Sheet1!A:E";

    if (spreadsheetId) {
      const sheets = google.sheets({ version: "v4", auth });
      const pstWhen = isoToPSTString(whenISO);
      const sizeHuman = bytesToMB(file.size);

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          // Columns: mp4 name | size | user_wallet_address | day/time (PST) | tx_signature
          values: [[name, sizeHuman, wallet, pstWhen, tx]],
        },
      });

      const sheetMeta = await sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId,
        ranges: [range.split("!")[0]], // "Sheet1"
        includeGridData: false,
      });

      // Safely resolve the sheetId (tab id)
      const firstSheet = sheetMeta.data.sheets?.[0];
      const sheetId = firstSheet?.properties?.sheetId;
      if (sheetId == null) {
        throw new Error("Could not resolve sheetId for sorting.");
      }

      // Sort rows by the “Day/Time (PST)” column (e.g., column D -> index 3) ascending
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: spreadsheetId,
        requestBody: {
          requests: [
            {
              sortRange: { 
                range: {
                  sheetId,
                  // adjust start/end rows/cols to exclude header row
                  startRowIndex: 1,  // skip header row
                  startColumnIndex: 0,
                  endColumnIndex: 5, // A:E
                },
                sortSpecs: [
                  { dimensionIndex: 3, sortOrder: "ASCENDING" }, // D column
                ],
              },
            },
          ],
        },
      });
    }

    return NextResponse.json({ ok: true, file: created.data });
  } catch (e: unknown) {
    const message = getErrorMessage(e);
    const apiErr = e as GoogleApiErrorLike;
    // Log the raw API payload when available
    console.error("Drive upload error:", apiErr?.response?.data ?? e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
