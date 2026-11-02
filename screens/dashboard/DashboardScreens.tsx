"use client";
import Link from "next/link";

import { useState, type ReactNode } from "react";
import {
  usePreview as useSaved,
  readObject,
  type InternPreview,
} from "@/lib/preview-store";
import { useEntitlements } from "@/lib/use-entitlements";
import { WALLET_PLACEHOLDER } from "@/config/mvp";
import { TalentStrip } from "@/components/talent/talent-strip";
import { NotificationBell } from "@/components/layout/notification-bell";
import { usePathname } from "next/navigation";
import { ShieldIcon } from "@/components/ui/icons";
import { FormCard } from "@/components/ui/form-layout";
import {
  primaryButtonClass,
  secondaryButtonClass,
  FormInput,
  FormField,
} from "@/components/ui/form-controls";

export { usePreview as useSaved } from "@/lib/preview-store";
export const accentButton = `${primaryButtonClass} !bg-accent`;
export function Badge({
  children,
  active = false,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={`inline-flex rounded-sm border-2 border-black px-2 py-0.5 text-xs font-medium ${active ? "bg-black text-white" : ""}`}
    >
      {children}
    </span>
  );
}
export function DashboardShell({
  company = false,
  children,
}: {
  company?: boolean;
  children: ReactNode;
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const saved = useSaved("skifa-company", "{}");
  const name = JSON.parse(saved).name || "Your company";
  const links = company
    ? [
        ["Dashboard", "/company/dashboard"],
        ["Browse talent", "/talent"],
        ["Wallet", "/company/wallet"],
      ]
    : [
        ["Dashboard", "/intern/dashboard"],
        ["Wallet", "/intern/wallet"],
      ];
  return (
    <div className="flex min-h-screen flex-col">
      <header
        className={`mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8 ${company ? "flex-wrap gap-3" : "flex-wrap gap-3"}`}
      >
        <Link className="font-display text-2xl font-bold" href="/">
          Skifa
        </Link>
        {company ? (
          <div className="relative order-2 sm:order-3">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 rounded-sm border-2 border-black px-2 py-1 text-sm font-medium"
            >
              <span className="grid size-6 place-items-center rounded-sm bg-black text-xs text-white">
                {name[0]}
              </span>
              <span className="max-w-32 truncate">{name}</span>
              <span aria-hidden>⌄</span>
            </button>
            {open ? (
              <div className="absolute right-0 z-20 mt-2 w-48 border-2 border-black bg-white p-2 shadow-hard">
                <Link
                  className="block p-2 text-sm hover:bg-muted"
                  href="/signup/company"
                >
                  Company account
                </Link>
                <Link
                  className="block p-2 text-sm hover:bg-muted"
                  href="/login"
                >
                  Log out
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}
        <nav
          className={`flex gap-1 ${company ? "order-3 w-full overflow-x-auto sm:order-2 sm:w-auto" : ""}`}
        >
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
              className={`whitespace-nowrap rounded-sm border-2 px-3 py-1.5 text-sm font-medium hover:border-black ${path === href ? "border-black bg-black text-white" : "border-transparent"}`}
            >
              {label}
            </a>
          ))}
          {!company ? <NotificationBell /> : null}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-16 sm:px-8">
        {children}
      </main>
      <footer className="mx-auto w-full max-w-6xl px-5 py-8 text-sm text-muted-foreground sm:px-8">
        © 2026 Skifa
      </footer>
    </div>
  );
}
export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-md border-2 border-black">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b-2 border-black">
            {columns.map((column) => (
              <th className="px-4 py-3 font-medium" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function CompanyDashboard() {
  const saved = useSaved("skifa-company", "{}");
  const company = JSON.parse(saved);
  const [requested, setRequested] = useState(false);
  return (
    <DashboardShell company>
      <TalentStrip count={6} />
      <div className="mt-10" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Dashboard</p>
          <h1 className="text-4xl font-bold sm:text-5xl">
            {company.name || "Acme Labs"}
          </h1>
        </div>
        <Link className={accentButton} href="/talent">
          Browse talent
        </Link>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          ["Wallet balance", "$1,250.00"],
          ["Active placements", "2"],
          ["Monthly payroll", "$720.00"],
        ].map(([label, value], index) => (
          <div key={label} className="rounded-md border-2 border-black p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 font-display text-4xl font-bold">{value}</p>
            {index === 0 ? (
              <Link
                href="/company/wallet"
                className="mt-3 inline-block text-sm font-medium underline underline-offset-4"
              >
                View wallet →
              </Link>
            ) : null}
          </div>
        ))}
      </div>
      <h2 className="mt-14 mb-4 text-2xl font-bold">Placements</h2>
      <DataTable
        columns={["Intern", "Role", "Start date", "Monthly stipend", "Status"]}
        rows={[
          [
            "amara-okafor",
            "Amara Okafor",
            "Frontend intern",
            "4 Aug 2026",
            "$400.00",
            "Active",
          ],
          [
            "chinedu-eze",
            "Chinedu Eze",
            "Data analyst intern",
            "14 Jul 2026",
            "$320.00",
            "Active",
          ],
          [
            "fatou-musa",
            "Amina Musa",
            "Support intern",
            "1 Apr 2026",
            "$200.00",
            "Ended",
          ],
        ].map(([id, name, role, start, amount, status]) => [
          <a
            key={id}
            href={`/talent/${id}`}
            className="font-medium hover:underline"
          >
            {name}
          </a>,
          role,
          start,
          amount,
          <Badge key="status" active={status === "Active"}>
            {status}
          </Badge>,
        ])}
      />
      <FormCard className="mt-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <ShieldIcon className="mt-0.5 size-6 shrink-0" />
            <div>
              <h2 className="text-xl font-bold">Replacement guarantee</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                If an intern underperforms, Skifa replaces them at no extra
                cost.
              </p>
            </div>
          </div>
          <button
            className={secondaryButtonClass}
            onClick={() => setRequested(true)}
          >
            Request replacement
          </button>
        </div>
        {requested ? (
          <p role="status" className="mt-4 text-sm">
            Replacement request sent
          </p>
        ) : null}
      </FormCard>
    </DashboardShell>
  );
}
export function InternDashboard() {
  const profile = readObject<InternPreview>(useSaved("skifa-intern", "{}"), {});
  const entitlement = useEntitlements();
  const previewActive =
    useSaved("skifa-wallet-preview", "inactive") === "active";
  const walletActive = entitlement.walletActive || previewActive;
  const visible = entitlement.profileVisible || profile.visible === true;
  const verification = useSaved("skifa-verification", "not_started");
  const video = useSaved("skifa-video", "");
  const name = profile.fullName || "Amara Okafor";
  const rows = [
    {
      label: "Profile",
      done: true,
      description: "Complete",
      href: "",
      action: "",
    },
    {
      label: "Profile visibility",
      done: visible,
      description: visible ? "Visible to companies" : "Not visible yet",
      href: "/intern/make-visible",
      action: "Make profile visible",
    },
    {
      label: "Wallet activation",
      done: walletActive,
      description: walletActive
        ? "Activated"
        : verification === "pending"
          ? "NIN pending review"
          : "Not activated",
      href:
        verification === "pending"
          ? "/intern/verification"
          : "/intern/verify-id",
      action: "Activate Wallet",
    },
    {
      label: "Video CV (Pro)",
      done: entitlement.pro && !!video,
      description: entitlement.pro
        ? video
          ? "Saved"
          : "Ready to record"
        : "Locked · Pro feature",
      href: "/intern/video-cv",
      action: entitlement.pro ? "Open Video CV" : "View Pro feature",
    },
  ];
  const main = rows.findIndex((row) => !row.done);
  return (
    <DashboardShell>
      <h1 className="mt-6 text-4xl font-bold sm:text-5xl">
        Welcome, {name.split(" ")[0]}
      </h1>
      <p className="mt-2 text-muted-foreground">
        You&apos;re one step closer to your first placement. Keep going!
      </p>
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <FormCard>
          <h2 className="text-2xl font-bold">Setup checklist</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.filter((row) => row.done).length} of {rows.length} complete
          </p>
          <ul className="mt-6 space-y-4">
            {rows.map((row, index) => (
              <li
                key={row.label}
                className={
                  "flex flex-col gap-3 rounded-md border-2 border-black p-4 sm:flex-row sm:items-center sm:justify-between " +
                  (!row.done ? "border-dashed" : "")
                }
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={
                      "grid size-8 shrink-0 place-items-center rounded-full border-2 border-black " +
                      (row.done ? "bg-black text-white" : "")
                    }
                    aria-hidden
                  >
                    {row.done ? "✓" : "○"}
                  </span>
                  <div>
                    <p className="font-medium">{row.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {row.description}
                    </p>
                  </div>
                </div>
                {row.href ? (
                  <Link
                    href={row.href as "/intern/dashboard"}
                    className={
                      index === main ? accentButton : secondaryButtonClass
                    }
                  >
                    {row.action}
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </FormCard>
        <div className="space-y-8">
          <FormCard>
            <h2 className="text-lg font-bold">How companies see you</h2>
            <div className="mt-5 flex items-center gap-4">
              <div className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-black font-display text-lg font-bold">
                {name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-xl font-bold">
                  {name}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {profile.headline || "Frontend intern"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>
                {profile.skills?.[0]?.name || profile.skill || "React"}
              </Badge>
              <Badge>
                {profile.city || "Lagos"}, {profile.state || "Lagos"}
              </Badge>
            </div>
          </FormCard>
          <FormCard>
            <h2 className="text-lg font-bold">Wallet</h2>
            <p className="mt-3 font-display text-4xl font-bold">
              {walletActive ? "$560.00" : WALLET_PLACEHOLDER}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {walletActive
                ? "Available to withdraw."
                : "Locked until wallet activation."}
            </p>
            <Link
              className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
              href="/intern/wallet"
            >
              View wallet →
            </Link>
          </FormCard>
        </div>
      </div>
    </DashboardShell>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md border-2 border-black bg-white p-6 shadow-hard"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">{title}</h3>
          <button type="button" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
export function WalletScreen({ company = false }: { company?: boolean }) {
  const entitlement = useEntitlements();
  const activePreview =
    useSaved("skifa-wallet-preview", "inactive") === "active";
  const walletActive = company || entitlement.walletActive || activePreview;
  const [tab, setTab] = useState("All");
  const [action, setAction] = useState("");
  const [amount, setAmount] = useState("");
  const [notice, setNotice] = useState("");
  const transactions = company
    ? [
        ["2 Oct 2026", "Wallet top-up", "+$500.00", "Pending"],
        ["30 Sept 2026", "Salary - Amara Okafor", "−$400.00", "Completed"],
        ["30 Sept 2026", "Processing fee", "−$40.00", "Completed"],
        ["29 Sept 2026", "Salary - Kwame Mensah", "−$320.00", "Completed"],
        ["29 Sept 2026", "Processing fee", "−$32.00", "Completed"],
        ["15 Sept 2026", "Wallet top-up", "+$2,042.00", "Completed"],
      ]
    : [
        ["1 Oct 2026", "Withdrawal", "−$200.00", "Pending"],
        ["30 Sept 2026", "Salary - Acme Labs", "+$400.00", "Completed"],
        ["5 Sept 2026", "Withdrawal", "−$40.00", "Completed"],
        ["31 Aug 2026", "Salary - Acme Labs", "+$400.00", "Completed"],
      ];
  const rows = (walletActive ? transactions : []).filter(
    (row) =>
      tab === "All" ||
      (tab === "Top-ups"
        ? row[1] === "Wallet top-up"
        : row[1].startsWith("Salary")),
  );
  return (
    <DashboardShell company={company}>
      <h1 className="text-4xl font-bold sm:text-5xl">Wallet</h1>
      <div className="mt-8 max-w-xl">
        <div className="border-2 border-black bg-white p-6 shadow-hard sm:p-8">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            {!walletActive ? (
              <svg
                aria-label="Wallet locked"
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            ) : null}
            Available balance
          </p>
          <p className="mt-2 font-display text-5xl font-bold sm:text-6xl">
            {company
              ? "$1,250.00"
              : walletActive
                ? "$560.00"
                : WALLET_PLACEHOLDER}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {!walletActive ? (
              <Link href="/intern/verify-id" className={accentButton}>
                Activate Wallet
              </Link>
            ) : (
              <button
                className={accentButton}
                onClick={() => setAction(company ? "Add funds" : "Withdraw")}
              >
                {company ? "Add funds" : "Withdraw"}
              </button>
            )}
            {company ? (
              <button
                className={secondaryButtonClass}
                onClick={() => setAction("Pay salary")}
              >
                Pay salary
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <section className="mt-14">
        <h2 className="mb-4 text-2xl font-bold">Transactions</h2>
        {!walletActive ? (
          <p className="mb-4 rounded-md border-2 border-dashed border-black p-5 text-sm text-muted-foreground">
            Activate your wallet to receive placement payments. No transactions
            yet.
          </p>
        ) : null}
        {company ? (
          <div role="tablist" className="mb-6 flex gap-2">
            {["All", "Top-ups", "Salaries"].map((label) => (
              <button
                key={label}
                role="tab"
                aria-selected={tab === label}
                className={`rounded-sm border-2 px-4 py-2 text-sm font-medium ${tab === label ? "border-black bg-black text-white" : "border-transparent hover:border-black"}`}
                onClick={() => setTab(label)}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}
        <div className="hidden sm:block">
          <DataTable
            columns={["Date", "Description", "Amount", "Status"]}
            rows={rows.map(([date, description, value, status]) => [
              date,
              description,
              value,
              <Badge key="status" active={status === "Completed"}>
                {status}
              </Badge>,
            ])}
          />
        </div>
        <ul className="flex flex-col gap-3 sm:hidden">
          {rows.map(([date, description, value, status], index) => (
            <li key={index} className="rounded-md border-2 border-black p-4">
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-medium">{description}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{date}</p>
                </div>
                <p className="font-medium">{value}</p>
              </div>
              <div className="mt-2">
                <Badge active={status === "Completed"}>{status}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </section>
      {notice ? (
        <p role="status" className="mt-6 rounded-md border-2 border-black p-4">
          {notice}
        </p>
      ) : null}
      {action ? (
        <Modal title={action} onClose={() => setAction("")}>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              setNotice(
                `${action} request saved. Demo only — no money was moved.`,
              );
              setAction("");
            }}
          >
            {action === "Pay salary" ? (
              <FormField label="Intern">
                <select className="w-full rounded-sm border-2 border-black p-3">
                  <option>Amara Okafor</option>
                  <option>Kwame Mensah</option>
                </select>
              </FormField>
            ) : null}
            <FormField label="Amount (USD)">
              <FormInput
                type="number"
                min="1"
                max={action === "Withdraw" ? 560 : undefined}
                required
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </FormField>
            <p className="text-xs text-muted-foreground">
              Demo only — no payment is taken.
            </p>
            <button className={`w-full ${primaryButtonClass}`}>Continue</button>
          </form>
        </Modal>
      ) : null}
    </DashboardShell>
  );
}
