"use client";
import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { backendRequest, errorMessage } from "@/lib/backend";
import { SiteShell } from "@/components/layout/site-shell";
import {
  FormField,
  FormInput,
  primaryButtonClass,
} from "@/components/ui/form-controls";
import { FormCard, FormHeading } from "@/components/ui/form-layout";
export function LoginScreen() {
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <SiteShell>
      <main className="flex flex-1 flex-col">
        <div className="flex flex-1 items-center justify-center px-5 py-12">
          <FormCard className="w-full max-w-md">
            <FormHeading
              title="Welcome back"
              subtitle="Log in to continue to Skifa."
            />
            <form
              className="mt-8 space-y-5"
              onSubmit={async (event) => {
                event.preventDefault();
                setBusy(true);
                setNotice("");
                const form = new FormData(event.currentTarget);
                try {
                  const result = await backendRequest<{
                    nextPath?: string;
                    user?: { role?: string };
                  }>("/auth/login", {
                    method: "POST",
                    body: {
                      email: form.get("email"),
                      password: form.get("password"),
                    },
                  });
                  router.push(
                    (result.nextPath ||
                      (result.user?.role === "company"
                        ? "/company/dashboard"
                        : "/intern/dashboard")) as Route,
                  );
                  router.refresh();
                } catch (error) {
                  setNotice(errorMessage(error));
                } finally {
                  setBusy(false);
                }
              }}
            >
              <FormField label="Email">
                <FormInput
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={255}
                  placeholder="amara@example.com"
                />
              </FormField>
              <FormField label="Password">
                <FormInput
                  required
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  minLength={6}
                  placeholder="••••••••"
                />
              </FormField>
              <button
                disabled={busy}
                type="submit"
                className={`w-full ${primaryButtonClass}`}
              >
                {busy ? "Logging in…" : "Log in"}
              </button>
              {notice ? (
                <p role="status" className="text-sm text-muted-foreground">
                  {notice}
                </p>
              ) : null}
            </form>
            <div className="mt-8 space-y-1 text-sm">
              <p>New here?</p>
              <p>
                <Link
                  href="/signup/company"
                  className="font-medium underline underline-offset-4"
                >
                  Sign up as a Company
                </Link>{" "}
                ·{" "}
                <Link
                  href="/signup/intern"
                  className="font-medium underline underline-offset-4"
                >
                  Sign up as a Prospect
                </Link>
              </p>
            </div>
          </FormCard>
        </div>
      </main>
    </SiteShell>
  );
}
