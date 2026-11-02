import Link from "next/link";
import type { ReactNode } from "react";

type SiteShellProps = {
  children: ReactNode;
  showLogin?: boolean;
  tone?: "white" | "muted";
  showFooter?: boolean;
};

export function SiteShell({
  children,
  showLogin = true,
  tone = "white",
  showFooter = true,
}: SiteShellProps) {
  return (
    <div
      className={`flex min-h-screen flex-col font-sans text-black ${tone === "muted" ? "bg-muted" : "bg-white"}`}
    >
      <header className="mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between px-5 py-6 sm:px-8">
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-tight"
          aria-label="Skifa home"
        >
          Skifa
        </Link>
        {showLogin ? (
          <a
            href="/login"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Log in
          </a>
        ) : null}
      </header>

      {children}

      {showFooter ? (
        <footer className="mx-auto w-full max-w-6xl shrink-0 px-5 py-8 text-sm text-muted-foreground sm:px-8">
          © 2026 Skifa
        </footer>
      ) : null}
    </div>
  );
}
