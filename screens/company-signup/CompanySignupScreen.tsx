"use client";

import { useState } from "react";

import { SiteShell } from "@/components/layout/site-shell";

export function CompanySignupScreen() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <SiteShell>
      <main className="flex flex-1 items-center px-6 py-16 sm:py-24">
        <section className="mx-auto w-full max-w-md rounded-md border-2 border-black bg-white p-6 sm:p-8">
          <h1 className="font-display text-3xl font-bold leading-tight">
            Sign up as a Company
          </h1>

          <form
            className="mt-8 space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <div>
              <label
                htmlFor="company-name"
                className="mb-1.5 block text-sm font-medium"
              >
                Company name
              </label>
              <input
                id="company-name"
                name="companyName"
                type="text"
                autoComplete="organization"
                required
                maxLength={100}
                className="w-full rounded-sm border-2 border-black bg-white px-3 py-2.5 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000]"
              />
            </div>

            <div>
              <label
                htmlFor="company-email"
                className="mb-1.5 block text-sm font-medium"
              >
                Email
              </label>
              <input
                id="company-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={255}
                className="w-full rounded-sm border-2 border-black bg-white px-3 py-2.5 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000]"
              />
            </div>

            <div>
              <label
                htmlFor="company-size"
                className="mb-1.5 block text-sm font-medium"
              >
                Company size
              </label>
              <select
                id="company-size"
                name="companySize"
                defaultValue="1-10"
                className="w-full rounded-sm border-2 border-black bg-white px-3 py-2.5 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000]"
              >
                <option value="1-10">1–10</option>
                <option value="11-50">11–50</option>
                <option value="51-200">51–200</option>
                <option value="200+">200+</option>
              </select>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-sm border-2 border-black bg-black px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#000]"
            >
              Create account
            </button>

            {submitted ? (
              <p role="status" className="text-sm font-medium text-[#6d3ddb]">
                Company details saved. Backend account creation is the next
                integration step.
              </p>
            ) : null}
          </form>

          <p className="mt-6 text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium underline underline-offset-4"
            >
              Log in
            </a>
          </p>
        </section>
      </main>
    </SiteShell>
  );
}
