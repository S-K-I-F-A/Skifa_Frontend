"use client";
import Link from "next/link";
import { usePreview, readObject } from "@/lib/preview-store";
import { notifications } from "@/src/data/notifications";
function useRead() {
  return readObject<string[]>(usePreview("skifa-read-notifications", "[]"), []);
}
export function NotificationBell() {
  const read = useRead();
  const count = notifications.filter((item) => !read.includes(item.id)).length;
  return (
    <Link
      href="/intern/notifications"
      aria-label={"Notifications, " + count + " unread"}
      className="relative inline-flex items-center justify-center rounded-sm border-2 border-transparent px-3 py-1.5 hover:border-black"
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="size-5"
      >
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </svg>
      {count ? (
        <span
          aria-hidden
          className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-black px-1 text-xs text-white"
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}
