"use client";
import Link from "next/link";
import { useState } from "react";
import {
  DashboardShell,
  accentButton,
} from "@/screens/dashboard/DashboardScreens";
import { FormCard } from "@/components/ui/form-layout";
import { useEntitlements } from "@/lib/use-entitlements";
import { errorMessage, startCheckout } from "@/lib/backend";
export function MakeVisibleScreen() {
  const entitlement = useEntitlements();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  return (
    <DashboardShell>
      <div className="mx-auto mt-8 max-w-xl">
        <FormCard>
          <h1 className="text-3xl font-bold">Profile visibility</h1>
          <p className="mt-3 text-muted-foreground">
            {entitlement.profileVisible
              ? "Your profile is visible to companies."
              : "Your profile is private. Pay the one-time visibility fee when you are ready to be discovered by companies."}
          </p>
          {!entitlement.profileVisible ? (
            <>
              <p className="mt-6 font-display text-4xl font-bold">$1.00</p>
              <button
                className={"mt-8 w-full " + accentButton}
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await startCheckout("profile_visibility");
                  } catch (error) {
                    setNotice(errorMessage(error));
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? "Connecting…" : "Make profile visible"}
              </button>
            </>
          ) : null}
          <Link
            href="/intern/dashboard"
            className="mt-5 block text-center text-sm underline underline-offset-4"
          >
            Back to dashboard
          </Link>
          {notice ? (
            <p role="status" className="mt-5 text-sm">
              {notice}
            </p>
          ) : null}
        </FormCard>
      </div>
    </DashboardShell>
  );
}
