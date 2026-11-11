"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { SiteShell } from "@/components/layout/site-shell";
import {
  FormField,
  FormInput,
  primaryButtonClass,
} from "@/components/ui/form-controls";
import { FormCard, FormHeading } from "@/components/ui/form-layout";
import { backendRequest, errorMessage } from "@/lib/backend";

export function ForgotPasswordScreen() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    const form = new FormData(event.currentTarget);
    try {
      await backendRequest("/auth/password/forgot", {
        method: "POST",
        body: { email: form.get("email") },
      });
      setSent(true);
    } catch (error) {
      setNotice(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteShell showLogin={false}>
      <main className="flex flex-1 items-start justify-center bg-[#f7f7f7] px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        <div className="w-full max-w-[480px]">
          <FormCard>
            <form onSubmit={submit}>
              <FormHeading
                title={sent ? "Check your inbox" : "Reset your password"}
                subtitle={
                  sent
                    ? "If an account exists for that email, we've sent password reset instructions."
                    : "Enter the email connected to your account and we'll send you a reset link."
                }
              />

              {!sent && (
                <>
                  <div className="mt-8">
                    <FormField label="Email">
                      <FormInput
                        required
                        name="email"
                        type="email"
                        maxLength={255}
                        autoComplete="email"
                        placeholder="you@example.com"
                      />
                    </FormField>
                  </div>
                  <button
                    type="submit"
                    disabled={busy}
                    className={`mt-8 w-full ${primaryButtonClass}`}
                  >
                    {busy ? "Sending…" : "Send reset link"}
                  </button>
                  {notice ? (
                    <p role="alert" className="mt-4 text-sm">
                      {notice}
                    </p>
                  ) : null}
                </>
              )}

              <a
                href="/login"
                className="mt-6 inline-flex font-medium underline underline-offset-4"
              >
                ← Back to log in
              </a>
            </form>
          </FormCard>
        </div>
      </main>
    </SiteShell>
  );
}
