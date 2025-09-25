"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  getAccount,
  getMint,
  createTransferCheckedInstruction,
} from "@solana/spl-token";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export type ViewsCheckoutProps = {
  /** Amount in WHOLE $VIEWS tokens (e.g., 1000) */
  amount: number;
  /** Called after a confirmed transaction */
  onPaid?: (signature: string) => void;
  /** Optional overrides; otherwise pulled from env */
  mintAddress?: string;
  treasuryAddress?: string;
  /** Line item label */
  label?: string;
  disabled?: boolean;
  beforePay?: () => Promise<void>;
};

function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  try {
    return typeof e === "string" ? e : JSON.stringify(e);
  } catch {
    return "Unknown error";
  }
}

export default function ViewsCheckout({
  amount,
  onPaid,
  mintAddress = process.env.NEXT_PUBLIC_VIEWS_MINT || "",
  treasuryAddress = process.env.NEXT_PUBLIC_TREASURY || "",
  label = "Livestream Ad Slot",
  disabled = false,
  beforePay,
}: ViewsCheckoutProps) {
  const { connection } = useConnection();
  const { publicKey, connected, sendTransaction } = useWallet();

  const [decimals, setDecimals] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [userBalanceRaw, setUserBalanceRaw] = useState<bigint | null>(null);

  const mint = useMemo(() => {
    try {
      return mintAddress ? new PublicKey(mintAddress) : null;
    } catch {
      return null;
    }
  }, [mintAddress]);

  const treasury = useMemo(() => {
    try {
      return treasuryAddress ? new PublicKey(treasuryAddress) : null;
    } catch {
      return null;
    }
  }, [treasuryAddress]);

  useEffect(() => {
    if (!treasuryAddress) {
      toast.error("Treasury address missing", {
        description: "Set NEXT_PUBLIC_TREASURY in your environment.",
      });
    }
  }, [treasuryAddress]);

  useEffect(() => {
    (async () => {
      if (!mint) return;
      try {
        const m = await getMint(connection, mint);
        setDecimals(m.decimals);
      } catch (e: unknown) {
        console.error(e);
        toast.error("Failed to load $VIEWS mint metadata (decimals).", {
          description: errorMessage(e),
        });
      }
    })();
  }, [connection, mint]);

  const refreshBalance = useCallback(async () => {
    if (!publicKey || !mint) return;
    setLoadingBalance(true);
    try {
      const ata = getAssociatedTokenAddressSync(mint, publicKey);
      const acc = await getAccount(connection, ata, "confirmed");
      setUserBalanceRaw(acc.amount);
    } catch (e: unknown) {
      const msg = errorMessage(e);
      if (msg.includes("Token account not found")) {
        setUserBalanceRaw(0n);
      } else {
        console.error(e);
        toast.error("Failed to load $VIEWS balance.", { description: msg });
      }
    } finally {
      setLoadingBalance(false);
    }
  }, [connection, mint, publicKey]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  const amountInBaseUnits = useMemo(() => {
    if (decimals == null) return null;
    const pow = BigInt(10) ** BigInt(decimals);
    return BigInt(amount) * pow;
  }, [amount, decimals]);

  const formatToken = (raw: bigint | null) => {
    if (raw == null || decimals == null) return "—";
    const pow = BigInt(10) ** BigInt(decimals);
    const whole = raw / pow;
    const frac = raw % pow;
    const fracStr =
      decimals > 0
        ? (frac + pow).toString().slice(1).replace(/0+$/, "").slice(0, 4)
        : "";
    return fracStr ? `${whole.toString()}.${fracStr}` : whole.toString();
  };

  const canPay =
    connected &&
    !!publicKey &&
    !!mint &&
    !!treasury &&
    decimals != null &&
    amount > 0 &&
    amountInBaseUnits != null;

  const handlePay = useCallback(async () => {
    if (loading) return; // guard double-taps
    if (!canPay || !publicKey || !mint || !treasury || amountInBaseUnits == null) return;

    try {
      // OPTIONAL step (see section 2): do something BEFORE paying (e.g., pre-upload)
      if (typeof beforePay === "function") {
        setLoading(true);
        await beforePay(); // throws if it fails; we abort the payment
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      toast.error("Cannot proceed to payment", { description: errorMessage(e) });
      return;
    }

    setLoading(true);
    try {
      const userATA = getAssociatedTokenAddressSync(mint, publicKey);
      const treasuryATA = getAssociatedTokenAddressSync(mint, treasury, true);

      try {
        await getAccount(connection, userATA, "confirmed");
      } catch {
        throw new Error(
          "Your $VIEWS token account was not found. Make sure you hold $VIEWS in this wallet."
        );
      }

      try {
        await getAccount(connection, treasuryATA, "confirmed");
      } catch {
        throw new Error(
          "Treasury token account (ATA) not found. Contact the team to set it up before accepting payments."
        );
      }

      if (userBalanceRaw != null && amountInBaseUnits > userBalanceRaw) {
        throw new Error("Insufficient $VIEWS balance for this payment.");
      }

      const ix = createTransferCheckedInstruction(
        userATA,
        mint,
        treasuryATA,
        publicKey,
        amountInBaseUnits,
        decimals!
      );

      const tx = new Transaction().add(ix);
      tx.feePayer = publicKey;
      const { blockhash } = await connection.getLatestBlockhash("finalized");
      tx.recentBlockhash = blockhash;

      const sig = await sendTransaction(tx, connection, { skipPreflight: false });
      toast.success("Payment submitted", { description: `Signature: ${sig.slice(0, 8)}…` });

      await connection.confirmTransaction(sig, "confirmed");
      toast.success("Payment confirmed ✅");

      onPaid?.(sig);
      refreshBalance();
    } catch (e: unknown) {
      console.error(e);
      toast.error("Payment failed", { description: errorMessage(e) });
    } finally {
      setLoading(false);
    }
  }, [
    canPay,
    publicKey,
    mint,
    treasury,
    amountInBaseUnits,
    decimals,
    connection,
    sendTransaction,
    onPaid,
    refreshBalance,
    userBalanceRaw,
    beforePay,
    loading
  ]);

  return (
    <Card className="bg-viewheel-card border-viewheel-border">
      <CardContent className="p-6">

        <div className="mt-6 grid gap-2 md:grid-cols-2">
          <div className="text-sm text-muted-foreground">
            <p className="text-muted-foreground text-sm text-left">Paying from:</p>
            <p className="text-foreground font-medium text-left">
              {publicKey ? `${publicKey.toBase58().slice(0, 4)}…${publicKey.toBase58().slice(-4)}` : "—"}
            </p>
            <p className="mt-4 text-muted-foreground text-sm text-left">Balance:</p>
            <p className="text-foreground font-medium text-left">
              {loadingBalance ? "…" : `${formatToken(userBalanceRaw)} $VIEWS`}
            </p>
          </div>
          <div className="text-sm text-muted-foreground md:text-right">
            <p className="text-muted-foreground text-sm text-left md:text-right">To treasury:</p>
            <p className="text-foreground font-medium text-left md:text-right">
              {treasury ? `${treasury.toBase58().slice(0, 4)}…${treasury.toBase58().slice(-4)}` : "—"}
            </p>
            <p className="mt-4 text-muted-foreground text-sm text-left md:text-right">Total Cost:</p>
            <p className="text-foreground font-medium text-left md:text-right">
              {amount.toLocaleString()} $VIEWS
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={handlePay}
            disabled={!canPay || loading || !treasuryAddress || disabled}
            className="w-full md:w-auto px-8"
          >
            {loading ? "Processing…" : "Pay & Submit"}
          </Button>
          {!connected && (
            <div className="text-sm text-red-400 mt-2">Connect your wallet to continue.</div>
          )}
          {!treasuryAddress && (
            <div className="text-sm text-red-400 mt-2">
              Missing NEXT_PUBLIC_TREASURY environment variable.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
