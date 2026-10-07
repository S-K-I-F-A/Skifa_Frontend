import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-semibold text-zinc-500">404</p>
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-zinc-600 dark:text-zinc-300">
        The page you requested does not exist.
      </p>
      <Link className="font-medium underline underline-offset-4" href="/">
        Return home
      </Link>
    </main>
  );
}
