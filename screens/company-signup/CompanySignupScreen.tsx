"use client";
import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NIGERIAN_STATES } from "@/config/mvp";
import { savePreview } from "@/lib/preview-store";
import { useEntitlements } from "@/lib/use-entitlements";
import { startCheckout, errorMessage } from "@/lib/backend";
import { SiteShell } from "@/components/layout/site-shell";
import {
  FormField,
  FormInput,
  FormTextarea,
  Dropdown,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/ui/form-controls";
import { FormCard } from "@/components/ui/form-layout";

const titles = [
  "Create your company account",
  "Tell us about your company",
  "Who should we contact?",
  "Activate your account",
];
const stages = ["Account", "Company details", "Contact & logo", "Activate"];
const required = [
  ["email", "password"],
  ["name", "industry", "state", "city", "address", "description", "size"],
  ["contactName", "jobTitle", "phone", "contactEmail"],
  [],
];
const industries = [
  "Software & SaaS",
  "Fintech",
  "E-commerce",
  "Media & Marketing",
  "Consulting",
  "Healthcare",
  "Education",
  "Logistics",
  "Other",
];

export function CompanySignupScreen() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({
    pay: "card",
    phone: "+234",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logo, setLogo] = useState("");
  const { companyActive: complete } = useEntitlements();
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  function persist() {
    savePreview("skifa-company", {
      ...Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== "password"),
      ),
      logo,
      active: false,
    });
  }
  async function activate() {
    persist();
    setBusy(true);
    try {
      await startCheckout("company_activation");
    } catch (error) {
      setNotice(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  const update = (key: string, value: string) =>
    setData((current) => ({ ...current, [key]: value }));
  function advance() {
    const nextErrors: Record<string, string> = {};
    required[step].forEach((key) => {
      if (!data[key]?.trim()) nextErrors[key] = "Required";
    });
    if (step === 0) {
      if (data.email && !/^\S+@\S+\.\S+$/.test(data.email))
        nextErrors.email = "Enter a valid work email";
      if (data.password && data.password.length < 8)
        nextErrors.password = "At least 8 characters";
    }
    if (
      step === 2 &&
      data.contactEmail &&
      !/^\S+@\S+\.\S+$/.test(data.contactEmail)
    )
      nextErrors.contactEmail = "Enter a valid email";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (step < 3) setStep(step + 1);
    else {
      void activate();
    }
  }
  function field(
    key: string,
    label: string,
    options: {
      type?: string;
      placeholder?: string;
      wide?: boolean;
      choices?: readonly string[];
    } = {},
  ) {
    return (
      <div key={key} className={options.wide ? "sm:col-span-2" : ""}>
        <FormField label={label}>
          {options.choices ? (
            <Dropdown
              value={data[key] || ""}
              onChange={(event) => update(key, event.target.value)}
            >
              <option value="">
                Select{" "}
                {key === "size"
                  ? "size"
                  : key === "state"
                    ? "state"
                    : "industry"}
              </option>
              {options.choices.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </Dropdown>
          ) : key === "description" ? (
            <FormTextarea
              value={data[key] || ""}
              maxLength={500}
              placeholder="What does your company do?"
              onChange={(event) => update(key, event.target.value)}
            />
          ) : (
            <FormInput
              type={options.type || "text"}
              value={data[key] || ""}
              maxLength={key.toLowerCase().includes("email") ? 255 : 120}
              placeholder={options.placeholder}
              onChange={(event) => update(key, event.target.value)}
              aria-invalid={!!errors[key]}
            />
          )}
          {errors[key] ? (
            <span role="alert" className="mt-1 block text-xs text-black">
              {errors[key]}
            </span>
          ) : null}
        </FormField>
      </div>
    );
  }
  return (
    <SiteShell showFooter={false}>
      <main className="flex flex-1 items-start justify-center px-5 py-8 sm:py-12">
        {complete ? (
          <FormCard className="w-full max-w-xl text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full border-2 text-2xl">
              ✓
            </div>
            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
              Your account is live
            </h1>
            <p className="mt-3 text-balance text-muted-foreground">
              {data.name} is set up and your company wallet is active. Start
              browsing ID-verified interns.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/talent"
                className={`${primaryButtonClass} !bg-accent`}
              >
                Browse talent
              </Link>
              <Link href="/company/dashboard" className={secondaryButtonClass}>
                Go to dashboard
              </Link>
            </div>
          </FormCard>
        ) : (
          <FormCard className="w-full max-w-2xl">
            <div className="mb-2 flex justify-between text-sm font-medium">
              <span>Step {step + 1} of 4</span>
              <span className="text-muted-foreground">{stages[step]}</span>
            </div>
            <div className="h-3 w-full rounded-sm border-2 border-black">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${(step + 1) * 25}%` }}
              />
            </div>
            <h1 className="mt-8 text-3xl font-bold">{titles[step]}</h1>
            <form
              noValidate
              className="mt-6 grid gap-4 sm:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                advance();
              }}
            >
              {step === 3 ? (
                <button
                  type="button"
                  className="mt-6 block w-full text-center text-sm font-medium underline underline-offset-4"
                  onClick={() => {
                    persist();
                    router.push("/company/profile-preview");
                  }}
                >
                  Skip for now and preview my profile
                </button>
              ) : null}
              {notice ? (
                <p role="status" className="mt-4 text-sm">
                  {notice}
                </p>
              ) : null}
              {step === 0 ? (
                <>
                  {field("email", "Work email", {
                    type: "email",
                    placeholder: "you@company.com",
                    wide: true,
                  })}
                  {field("password", "Password", {
                    type: "password",
                    placeholder: "At least 8 characters",
                    wide: true,
                  })}
                </>
              ) : null}
              {step === 1 ? (
                <>
                  {field("name", "Company name", { wide: true })}
                  {field("industry", "Industry", { choices: industries })}
                  {field("size", "Staff size", {
                    choices: ["1-10", "11-50", "51-200", "201-500", "500+"],
                  })}
                  {field("state", "Nigerian state", {
                    choices: NIGERIAN_STATES,
                  })}
                  {field("city", "City")}
                  {field("address", "Street address", { wide: true })}
                  {field("description", "Brief description", { wide: true })}
                </>
              ) : null}
              {step === 2 ? (
                <>
                  {field("contactName", "Contact person")}
                  {field("jobTitle", "Your position in the company", {
                    placeholder: "e.g. CEO, Head of Marketing, HR Manager",
                  })}
                  {field("phone", "Phone", { type: "tel" })}
                  {field("contactEmail", "Contact email", { type: "email" })}
                  <div className="sm:col-span-2">
                    <FormField label="Company logo (optional)">
                      <label className="flex cursor-pointer items-center gap-4 rounded-md border-2 border-dashed border-black p-4">
                        <span
                          role={logo ? "img" : undefined}
                          aria-label={logo ? "Logo preview" : undefined}
                          style={
                            logo
                              ? {
                                  backgroundImage: `url(${logo})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }
                              : undefined
                          }
                          className="grid size-16 place-items-center rounded-sm border-2 border-black text-xl"
                        >
                          {logo ? "" : "↑"}
                        </span>
                        <span className="text-sm">
                          <span className="font-medium">
                            {logo ? "Change logo" : "Upload logo"}
                          </span>
                          <br />
                          <span className="text-muted-foreground">
                            PNG or JPG, up to 2 MB
                          </span>
                        </span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg"
                          className="sr-only"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file && file.size <= 2e6) {
                              const reader = new FileReader();
                              reader.onload = () =>
                                setLogo(String(reader.result));
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </FormField>
                  </div>
                </>
              ) : null}
              {step === 3 ? (
                <div className="space-y-5 sm:col-span-2">
                  <div className="flex items-center justify-between rounded-md border-2 border-black p-4">
                    <div>
                      <p className="font-medium">One-time sign-up fee</p>
                      <p className="text-sm text-muted-foreground">
                        Your company wallet is activated on sign-up
                      </p>
                    </div>
                    <p className="font-display text-3xl font-bold">$5</p>
                  </div>
                  <fieldset>
                    <legend className="mb-1.5 text-sm font-medium">
                      Payment method
                    </legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        ["card", "Card"],
                        ["bank", "Bank transfer"],
                      ].map(([value, label]) => (
                        <label
                          key={value}
                          className={`flex cursor-pointer items-center gap-2 rounded-sm border-2 border-black p-3 text-sm font-medium ${data.pay === value ? "bg-black text-white" : ""}`}
                        >
                          <input
                            type="radio"
                            name="pay"
                            value={value}
                            checked={data.pay === value}
                            onChange={() => update("pay", value)}
                            className="sr-only"
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <p className="text-xs text-muted-foreground">
                    Payment processing is not connected yet. Your account stays
                    inactive until payment is confirmed.
                  </p>
                </div>
              ) : null}
              <div className="mt-2 flex gap-3 sm:col-span-2">
                {step > 0 ? (
                  <button
                    type="button"
                    className={secondaryButtonClass}
                    onClick={() => {
                      setErrors({});
                      setStep(step - 1);
                    }}
                  >
                    Back
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={busy}
                  className={`flex-1 ${primaryButtonClass}`}
                >
                  {step === 3 ? "Pay $5 and activate" : "Continue"}
                </button>
              </div>
            </form>
            {step === 0 ? (
              <p className="mt-6 text-sm">
                Already have an account?{" "}
                <Link
                  className="font-medium underline underline-offset-4"
                  href="/login"
                >
                  Log in
                </Link>
              </p>
            ) : null}
          </FormCard>
        )}
      </main>
    </SiteShell>
  );
}
