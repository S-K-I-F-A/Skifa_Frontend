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
export function UpgradeScreen() {
  const entitlement = useEntitlements();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  return (
    <DashboardShell>
      <div className="mx-auto mt-8 max-w-xl">
        <FormCard>
          <h1 className="text-3xl font-bold">
            {entitlement.pro ? "Pro is active" : "Unlock Video CV with Pro"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            Record or upload a 60-second video introduction and help companies
            get to know you.
          </p>
          {entitlement.pro ? (
            <Link href="/intern/video-cv" className={"mt-8 " + accentButton}>
              Open Video CV
            </Link>
          ) : (
            <>
              <p className="mt-5 text-sm">
                Your current profile and placement access stay available. Video
                CV requires confirmed Pro access.
              </p>
              <button
                disabled={busy || entitlement.loading}
                className={"mt-8 w-full " + accentButton}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await startCheckout("pro");
                  } catch (error) {
                    setNotice(errorMessage(error));
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? "Connecting…" : "Continue to upgrade"}
              </button>
              <p className="mt-3 text-xs text-muted-foreground">
                Pricing and checkout are provided by the payment service when
                connected.
              </p>
            </>
          )}
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
