import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type HeaderProps = {
  /** Anything you want on the right side (e.g., wallet button). */
  rightSlot?: ReactNode;
};

const Header = ({ rightSlot }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="block" aria-label="Viewheel home">
            <Image
              src="/viewheel-logo.svg"   // file lives in /public
              alt="Viewheel logo"
              width={48}
              height={48}
              priority
              className="h-12 w-12 animate-float"
            />
          </Link>
          <span className="ml-3 text-2xl font-bold text-primary">VIEWHEEL</span>
        </div>

        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
      </div>
    </header>
  );
};

export default Header;