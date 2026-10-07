import { SiteShell } from "@/components/layout/site-shell";
import {
  FormField,
  FormInput,
  primaryButtonClass,
} from "@/components/ui/form-controls";
import { FormCard, FormHeading } from "@/components/ui/form-layout";

export function LoginScreen() {
  return (
    <SiteShell>
      <main className="flex flex-1 flex-col">
        <div className="flex flex-1 items-center justify-center px-5 py-12">
          <FormCard className="w-full max-w-md">
            <FormHeading
              title="Welcome back"
              subtitle="Log in to continue to Skifa."
            />

            <form className="mt-8 space-y-5">
              <FormField label="Email">
                <FormInput
                  required
                  type="email"
                  maxLength={255}
                  autoComplete="email"
                  placeholder="amara@example.com"
                />
              </FormField>

              <FormField label="Password">
                <FormInput
                  required
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
              </FormField>

              <button type="submit" className={`w-full ${primaryButtonClass}`}>
                Log in
              </button>
            </form>

            <div className="mt-8 text-sm leading-5 text-black">
              <p className="mb-1">New here?</p>
              <p>
                <a href="/signup/company" className="underline underline-offset-2">
                  Sign up as a Company
                </a>{" "}
                ·{" "}
                <a href="/signup/intern" className="underline underline-offset-2">
                  Sign up as a Prospect
                </a>
              </p>
            </div>
          </FormCard>
        </div>
      </main>
    </SiteShell>
  );
}
