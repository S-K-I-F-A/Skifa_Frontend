import Link from "next/link";
import type { ReactNode } from "react";

type SiteShellProps = {
  children: ReactNode;
  showLogin?: boolean;
  tone?: "white" | "muted";
};

export function SiteShell({
  children,
  showLogin = true,
  tone = "white",
}: SiteShellProps) {
  return (
    <div
      className={`flex min-h-dvh flex-col font-sans text-black ${tone === "muted" ? "bg-[#f7f7f7]" : "bg-white"}`}
    >
      <header className="mx-auto flex h-20 w-full max-w-6xl shrink-0 items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="font-display text-2xl font-bold leading-none"
          aria-label="Skifa home"
        >
          Skifa
        </Link>
        {showLogin ? (
          <a href="/login" className="hidden text-sm font-medium sm:inline">
            Log in
          </a>
        ) : null}
      </header>

      {children}

      <footer className="mx-auto flex h-16 w-full max-w-6xl shrink-0 items-center px-5 text-sm text-zinc-600 sm:px-8">
        © 2026 Skifa
      </footer>
    </div>
  );
}
