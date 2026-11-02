"use client";
import { useState } from "react";
import { usePreview, readObject, savePreview } from "@/lib/preview-store";
import {
  DashboardShell,
  accentButton,
} from "@/screens/dashboard/DashboardScreens";
import { categories, notifications } from "@/src/data/notifications";
function useRead() {
  return readObject<string[]>(usePreview("skifa-read-notifications", "[]"), []);
}
export function NotificationsScreen() {
  const [tab, setTab] = useState<string>("All");
  const read = useRead();
  const filtered = notifications.filter(
    (item) => tab === "All" || item.category === tab,
  );
  return (
    <DashboardShell>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold sm:text-5xl">Notifications</h1>
          <p className="mt-2 text-muted-foreground">
            Your placement, payment and account updates.
          </p>
        </div>
        <button
          className={accentButton}
          onClick={() =>
            savePreview(
              "skifa-read-notifications",
              notifications.map((item) => item.id),
            )
          }
          disabled={read.length === notifications.length}
        >
          Mark all as read
        </button>
      </div>
      <div
        role="tablist"
        aria-label="Notification categories"
        className="mt-8 flex gap-2 overflow-x-auto pb-2"
      >
        {categories.map((category) => (
          <button
            key={category}
            role="tab"
            aria-selected={tab === category}
            className={
              "whitespace-nowrap rounded-sm border-2 px-4 py-2 text-sm font-medium " +
              (tab === category
                ? "border-black bg-black text-white"
                : "border-transparent hover:border-black")
            }
            onClick={() => setTab(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-label={tab} className="mt-6">
        {filtered.length ? (
          <ul className="divide-y-2 divide-black overflow-hidden rounded-md border-2 border-black">
            {filtered.map((item) => (
              <li key={item.id}>
                <button
                  className={
                    "flex w-full items-start gap-4 p-5 text-left hover:bg-muted " +
                    (!read.includes(item.id) ? "bg-muted/50" : "")
                  }
                  onClick={() =>
                    savePreview(
                      "skifa-read-notifications",
                      Array.from(new Set([...read, item.id])),
                    )
                  }
                  aria-label={
                    item.title + (read.includes(item.id) ? "" : " — unread")
                  }
                >
                  <span
                    aria-hidden
                    className="grid size-10 shrink-0 place-items-center rounded-sm border-2 border-black text-xl"
                  >
                    {item.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="font-sans text-base font-medium">
                        {item.title}
                      </h2>
                      <span className="text-xs text-muted-foreground">
                        {item.time}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  {!read.includes(item.id) ? (
                    <span
                      aria-label="Unread"
                      className="mt-2 size-2.5 shrink-0 rounded-full bg-black"
                    />
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-md border-2 border-dashed border-black p-12 text-center">
            <h2 className="text-2xl font-bold">No notifications yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your {tab.toLowerCase()} updates will appear here.
            </p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
