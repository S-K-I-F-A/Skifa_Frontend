"use client";
import Link from "next/link";
import { useState } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import {
  FormField,
  FormInput,
  primaryButtonClass,
} from "@/components/ui/form-controls";
import { FormCard, FormHeading } from "@/components/ui/form-layout";
export function LoginScreen() {
  const [notice, setNotice] = useState("");
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
              onSubmit={(event) => {
                event.preventDefault();
                setNotice("Demo only — sign-in isn't connected yet.");
              }}
            >
              <FormField label="Email">
                <FormInput
                  required
                  type="email"
                  autoComplete="email"
                  maxLength={255}
                  placeholder="amara@example.com"
                />
              </FormField>
              <FormField label="Password">
                <FormInput
                  required
                  type="password"
                  autoComplete="current-password"
                  minLength={6}
                  placeholder="••••••••"
                />
              </FormField>
              <button type="submit" className={`w-full ${primaryButtonClass}`}>
                Log in
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
