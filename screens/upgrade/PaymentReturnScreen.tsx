"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { FormCard } from "@/components/ui/form-layout";
import { primaryButtonClass } from "@/components/ui/form-controls";
import {
  backendRequest,
  errorMessage,
  requestConfirmation,
  type Entitlements,
} from "@/lib/backend";
import {
  savePreview,
  readObject,
  type InternPreview,
} from "@/lib/preview-store";
export function PaymentReturnScreen() {
  const [visible, setVisible] = useState<boolean | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    backendRequest<Entitlements>("/entitlements")
      .then((result) => {
        if (!active) return;
        const profile = readObject<InternPreview>(
          sessionStorage.getItem("skifa-intern") || "{}",
          {},
        );
        const confirmed = result.profileVisible === true;
        savePreview("skifa-intern", { ...profile, visible: confirmed });
        setVisible(confirmed);
      })
      .catch((error) => {
        if (active) {
          setVisible(false);
          setNotice(errorMessage(error));
        }
      });
    return () => {
      active = false;
    };
  }, []);
  async function resend() {
    const profile = readObject<InternPreview>(
      sessionStorage.getItem("skifa-intern") || "{}",
      {},
    );
    if (!profile.email) {
      setNotice(
        "Add an email address to your account before requesting a confirmation.",
      );
      return;
    }
    setBusy(true);
    try {
      const result = await requestConfirmation(profile.email);
      setEmailSent(result.sent === true);
      if (!result.sent) setNotice("Confirmation email is pending.");
    } catch (error) {
      setNotice(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-xl px-5 py-12">
        <FormCard>
          <h1 className="text-3xl font-bold">Profile saved</h1>
          <p className="mt-4 font-medium">
            {visible === null
              ? "Checking payment confirmation…"
              : visible
                ? "Your profile is visible to companies."
                : "Your profile is not visible yet. Payment has not been confirmed."}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {emailSent
              ? "We've sent a confirmation email with your next steps."
              : "Confirmation email is pending."}
          </p>
          <button
            disabled={busy}
            onClick={resend}
            className="mt-3 text-sm font-medium underline underline-offset-4"
          >
            Resend email
          </button>
          {notice ? (
            <p role="status" className="mt-5 text-sm">
              {notice}
            </p>
          ) : null}
          <div>
            <Link
              href="/intern/dashboard"
              className={"mt-8 " + primaryButtonClass + " !bg-accent"}
            >
              Go to dashboard
            </Link>
          </div>
        </FormCard>
      </main>
    </SiteShell>
  );
}
