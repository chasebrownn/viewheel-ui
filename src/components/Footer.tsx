"use client";

import Image from "next/image";
import Link from "next/link";
import { Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-viewheel-border bg-viewheel-card/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo/Brand */}
          <div className="mb-6 md:mb-0 flex items-center gap-3">
            <Link href="/" className="block shrink-0" aria-label="Viewheel home">
              <Image
                src="/viewheel-logo.svg"
                alt="Viewheel logo"
                width={48}
                height={48}
                className="h-12 w-12"
                priority={false}
              />
            </Link>
            <div>
              <h3 className="text-2xl font-bold text-primary">VIEWHEEL</h3>
              <p className="text-muted-foreground">The first community-owned viewership network</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
            <a
              href="https://x.com/viewheel"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-viewheel-card border border-viewheel-border rounded-full flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 group"
            >
              <Twitter className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            {/* Telegram link can be re-enabled later */}
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-8 pt-8 border-t border-viewheel-border text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Viewheel. All rights reserved. | Community-owned • Decentralized • Transparent
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;