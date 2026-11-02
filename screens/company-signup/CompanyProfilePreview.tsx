"use client";
import Link from "next/link";
import { useState } from "react";
import {
  DashboardShell,
  accentButton,
} from "@/screens/dashboard/DashboardScreens";
import { FormCard } from "@/components/ui/form-layout";
import {
  usePreview,
  readObject,
  type CompanyPreview,
} from "@/lib/preview-store";
import { useEntitlements } from "@/lib/use-entitlements";
import { errorMessage, startCheckout } from "@/lib/backend";
export function CompanyProfilePreview() {
  const company = readObject<CompanyPreview>(
    usePreview("skifa-company", "{}"),
    {},
  );
  const entitlement = useEntitlements();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  return (
    <DashboardShell company>
      <div className="mx-auto mt-6 max-w-3xl">
        {!entitlement.companyActive ? (
          <section className="mb-8 flex flex-col gap-4 rounded-md border-2 border-black p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Activate your account</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Your company profile is in preview mode. Activate your account
                to view full talent profiles.
              </p>
            </div>
            <button
              disabled={busy}
              className={accentButton}
              onClick={async () => {
                setBusy(true);
                try {
                  await startCheckout("company_activation");
                } catch (error) {
                  setNotice(errorMessage(error));
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "Connecting…" : "Activate account"}
            </button>
          </section>
        ) : (
          <p className="mb-6 text-sm font-medium">Company account activated</p>
        )}
        <FormCard>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {company.logo ? (
              <div
                role="img"
                aria-label="Company logo"
                className="size-24 shrink-0 rounded-sm border-2 border-black bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: "url(" + company.logo + ")" }}
              />
            ) : (
              <div className="grid size-24 shrink-0 place-items-center rounded-sm border-2 border-black font-display text-4xl font-bold">
                {company.name?.[0] || "C"}
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">
                Company profile preview
              </p>
              <h2 className="mt-1 text-3xl font-bold">
                {company.name || "Your company"}
              </h2>
              <p className="mt-2 text-sm">
                {company.industry || "Industry not added"} ·{" "}
                {[company.city, company.state, "Nigeria"]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          </div>
          <h3 className="mt-8 text-xl font-bold">About the company</h3>
          <p className="mt-3 whitespace-pre-wrap text-muted-foreground">
            {company.description || "No description added yet."}
          </p>
          <dl className="mt-8 grid gap-x-5 gap-y-3 text-sm sm:grid-cols-[180px_1fr]">
            {[
              ["Staff size", company.size],
              ["Street address", company.address],
              ["Contact person", company.contactName],
              ["Your position in the company", company.jobTitle],
              ["Contact email", company.contactEmail || company.email],
              ["Phone", company.phone],
            ].map(([label, value]) => (
              <div className="contents" key={label}>
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="break-words">{value || "Not added"}</dd>
              </div>
            ))}
          </dl>
        </FormCard>
        <Link
          className="mt-6 inline-block text-sm font-medium underline underline-offset-4"
          href="/talent"
        >
          Preview talent →
        </Link>
        {notice ? (
          <p
            role="status"
            className="mt-5 rounded-md border-2 border-black p-4 text-sm"
          >
            {notice}
          </p>
        ) : null}
      </div>
    </DashboardShell>
  );
}
