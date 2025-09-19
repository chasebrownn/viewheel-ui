// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { WalletContextProvider } from "@/components/providers/wallet-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Viewheel - The First Community-Owned Viewership Network",
  description: "Pay in $VIEWS to get your content on the livestream. Top holders get proportional airdrops from advertiser payments.",
  keywords: ["crypto", "web3", "viewership", "streaming", "token", "community"],
  authors: [{ name: "Viewheel Team" }],
  creator: "Viewheel",
  publisher: "Viewheel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReactQueryProvider>
          <WalletContextProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {children}
            </TooltipProvider>
          </WalletContextProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}