import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const name = (form.get("name") as string) || file.name || "upload.mp4";
    const whenISO = (form.get("whenISO") as string) || undefined;
    const wallet = (form.get("wallet") as string) || undefined;
    const tx = (form.get("tx") as string) || undefined;

    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
    const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!;
    const parent = process.env.DRIVE_PARENT_FOLDER_ID!;

    if (!email || !key || !parent) {
      return NextResponse.json({ error: "Drive env vars not set" }, { status: 500 });
    }

    const auth = new google.auth.JWT({
      email,
      key: key.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    // Stream by first buffering (simple, type-safe)
    const arrayBuf = await file.arrayBuffer();
    const nodeStream = Readable.from(Buffer.from(arrayBuf));

    const description = JSON.stringify(
      { whenISO, wallet, tx, uploadedAt: new Date().toISOString() },
      null,
      2
    );

    const res = await drive.files.create({
      requestBody: {
        name,
        parents: [parent],
        mimeType: file.type || "video/mp4",
        description,
      },
      media: {
        mimeType: file.type || "video/mp4",
        body: nodeStream,
      },
      fields: "id, name, mimeType, webViewLink, webContentLink",
      supportsAllDrives: true,
    });

    return NextResponse.json({ ok: true, file: res.data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    // eslint-disable-next-line no-console
    console.error("Drive upload error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
