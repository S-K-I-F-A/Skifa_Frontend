"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";

import { SiteShell } from "@/components/layout/site-shell";
import {
  Dropdown,
  FormField,
  FormInput,
  FormTextarea,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/ui/form-controls";
import { FormCard } from "@/components/ui/form-layout";

const countries = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "Rwanda",
  "Egypt",
  "Uganda",
  "Senegal",
  "Ethiopia",
  "Côte d'Ivoire",
];

const focusAreas = [
  "Software Engineering",
  "Product Design",
  "Data & Analytics",
  "Product Management",
  "Marketing",
  "Operations",
];

type PaymentMethod = "card" | "bank";

export function ProspectSignupScreen() {
  const [step, setStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [paid, setPaid] = useState(false);
  const [focus, setFocus] = useState("");
  const progress = Math.round((step / 7) * 100);

  function continueFlow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 2 && !paid) return;
    if (step === 7) {
      setComplete(true);
      return;
    }
    setStep((current) => Math.min(7, current + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <SiteShell tone="muted">
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-20 pt-4 sm:px-8">
        {!complete ? <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Step {step} of 7</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full border-2 border-black bg-white">
            <div
              className="h-full bg-[#7446e8] transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div> : null}

        <FormCard>
          {complete ? <Completion /> : <form onSubmit={continueFlow}>
            {step === 1 ? <AccountStep /> : null}
            {step === 2 ? (
              <PaymentStep
                method={paymentMethod}
                paid={paid}
                onMethodChange={setPaymentMethod}
                onPaid={() => setPaid(true)}
              />
            ) : null}
            {step === 3 ? <ProfileStep /> : null}
            {step === 4 ? <FocusStep value={focus} onChange={setFocus} /> : null}
            {step === 5 ? <ExperienceStep /> : null}
            {step === 6 ? <PreferencesStep /> : null}
            {step === 7 ? <FinishStep /> : null}

            <div className="mt-8 flex items-center justify-between gap-4">
              {step > 1 ? (
                <button
                  type="button"
                  className={secondaryButtonClass}
                  onClick={() => setStep((current) => Math.max(1, current - 1))}
                >
                  ← Back
                </button>
              ) : (
                <span />
              )}
              <button
                type="submit"
                disabled={step === 2 && !paid}
                className={primaryButtonClass}
              >
                {step === 7 ? "Create profile" : "Continue →"}
              </button>
            </div>
          </form>}
        </FormCard>

        {step === 1 ? (
          <p className="mt-6 text-center text-sm text-zinc-600">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-black underline underline-offset-2">
              Log in
            </a>
          </p>
        ) : null}
      </main>
    </SiteShell>
  );
}

function AccountStep() {
  return (
    <WizardStep
      title="Create your account"
      subtitle="Let's get you started — it only takes a few minutes."
    >
      <FormField label="Full name">
        <FormInput required maxLength={100} autoComplete="name" placeholder="Amara Okafor" />
      </FormField>
      <FormField label="Email">
        <FormInput required maxLength={255} type="email" autoComplete="email" placeholder="amara@example.com" />
      </FormField>
      <FormField label="Password">
        <FormInput required minLength={8} type="password" autoComplete="new-password" placeholder="At least 8 characters" />
      </FormField>
      <FormField label="Country">
        <Dropdown defaultValue="Nigeria">
          {countries.map((country) => <option key={country}>{country}</option>)}
        </Dropdown>
      </FormField>
    </WizardStep>
  );
}

function PaymentStep({ method, paid, onMethodChange, onPaid }: { method: PaymentMethod; paid: boolean; onMethodChange: (method: PaymentMethod) => void; onPaid: () => void }) {
  return (
    <WizardStep title="Pay the sign-up fee" subtitle="A small fee keeps Skifa full of serious talent.">
      <div className="rounded-sm border-2 border-black">
        <p className="border-b-2 border-black px-4 py-3 text-sm font-medium">Order summary</p>
        <div className="flex justify-between gap-4 px-4 py-3 text-sm"><span>Skifa sign-up fee (one-time)</span><span>$1.00</span></div>
        <div className="flex justify-between gap-4 border-t border-zinc-300 px-4 py-3 font-medium"><span>Total</span><span>$1.00</span></div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Payment method</p>
        <div className="grid grid-cols-2 gap-3">
          <MethodButton active={method === "card"} onClick={() => onMethodChange("card")}>Card</MethodButton>
          <MethodButton active={method === "bank"} onClick={() => onMethodChange("bank")}>Bank transfer</MethodButton>
        </div>
      </div>

      {method === "card" ? (
        <div className="space-y-5">
          <FormField label="Card number"><FormInput inputMode="numeric" placeholder="4242 4242 4242 4242" /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Expiry"><FormInput inputMode="numeric" placeholder="MM/YY" /></FormField>
            <FormField label="CVC"><FormInput inputMode="numeric" placeholder="123" /></FormField>
          </div>
          <button type="button" className={`w-full ${primaryButtonClass}`} onClick={onPaid}>{paid ? "Paid" : "Pay $1"}</button>
        </div>
      ) : (
        <div className="rounded-sm border-2 border-black p-4 text-sm">
          <p>Transfer $1.00 (≈ ₦1,550) to:</p>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
            <dt className="text-zinc-500">Bank</dt><dd className="font-medium">Providus Bank</dd>
            <dt className="text-zinc-500">Account</dt><dd className="font-medium">9902 418 337</dd>
            <dt className="text-zinc-500">Name</dt><dd className="font-medium">Skifa Talent Ltd</dd>
            <dt className="text-zinc-500">Reference</dt><dd className="font-medium">SKF-TU-2041</dd>
          </dl>
          <button type="button" className={`mt-5 w-full ${primaryButtonClass}`} onClick={onPaid}>{paid ? "Payment confirmed" : "I've sent $1"}</button>
        </div>
      )}
    </WizardStep>
  );
}

function ProfileStep() {
  return <WizardStep title="Tell us about yourself" subtitle="Help companies understand who you are and what you want to do."><FormField label="Professional headline"><FormInput required maxLength={100} placeholder="Aspiring product designer" /></FormField><FormField label="Short bio"><FormTextarea required maxLength={500} placeholder="Share a little about your background and goals" /></FormField></WizardStep>;
}

function FocusStep({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <WizardStep title="Choose your focus" subtitle="What kind of opportunity are you looking for?"><div className="grid gap-3 sm:grid-cols-2">{focusAreas.map((area) => <label key={area} className={`flex min-h-14 cursor-pointer items-center rounded-sm border-2 px-4 text-sm font-medium transition ${value === area ? "border-black bg-[#eee8ff] shadow-[3px_3px_0_#000]" : "border-black bg-white"}`}><input required type="radio" name="focus" className="mr-3 accent-[#7446e8]" checked={value === area} onChange={() => onChange(area)} />{area}</label>)}</div><FormField label="Skills" hint="Separate each skill with a comma."><FormTextarea required placeholder="e.g. Figma, user research, prototyping" /></FormField></WizardStep>;
}

function ExperienceStep() {
  return <WizardStep title="Your experience" subtitle="Tell us where you are in your career journey."><FormField label="Experience level"><Dropdown required defaultValue=""><option value="" disabled>Select your level</option><option>Student</option><option>Recent graduate</option><option>0–2 years experience</option><option>3+ years experience</option></Dropdown></FormField><FormField label="Highest level of education"><Dropdown required defaultValue=""><option value="" disabled>Select education</option><option>Secondary school</option><option>Diploma</option><option>Bachelor&apos;s degree</option><option>Master&apos;s degree</option><option>Other</option></Dropdown></FormField></WizardStep>;
}

function PreferencesStep() {
  return <WizardStep title="Availability and preferences" subtitle="Let companies know when and how you can work."><FormField label="When can you start?"><Dropdown required defaultValue=""><option value="" disabled>Select availability</option><option>Immediately</option><option>Within 2 weeks</option><option>Within 1 month</option><option>More than 1 month</option></Dropdown></FormField><FormField label="Work preference"><Dropdown required defaultValue=""><option value="" disabled>Select preference</option><option>Remote</option><option>Hybrid</option><option>On-site</option><option>Open to any</option></Dropdown></FormField></WizardStep>;
}

function FinishStep() {
  return <WizardStep title="Finish your profile" subtitle="Add links that help companies learn more about your work."><FormField label="LinkedIn profile (optional)"><FormInput type="url" placeholder="https://linkedin.com/in/yourname" /></FormField><FormField label="Portfolio or website (optional)"><FormInput type="url" placeholder="https://yourportfolio.com" /></FormField><div className="rounded-sm border-2 border-black bg-white p-4 text-sm text-zinc-600">By creating your profile, you agree that the information you provide may be shared with companies offering relevant opportunities.</div></WizardStep>;
}

function WizardStep({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return <div><h1 className="font-display text-3xl font-bold leading-9 text-black sm:text-4xl sm:leading-10">{title}</h1><p className="mt-2 text-zinc-600">{subtitle}</p><div className="mt-7 space-y-5">{children}</div></div>;
}

function MethodButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={`h-11 rounded-sm border-2 border-black px-4 text-sm font-medium transition ${active ? "bg-black text-white" : "bg-white text-black"}`}>{children}</button>;
}

function Completion() {
  return <div className="py-10 text-center" role="status"><div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-[#7446e8] text-2xl text-white">✓</div><h1 className="font-display text-4xl font-bold">You&apos;re all set</h1><p className="mx-auto mt-3 max-w-sm text-zinc-600">Your prospect profile is ready. We&apos;ll use it to connect you with suitable opportunities.</p><Link href="/" className={`mt-8 ${primaryButtonClass}`}>Back to home</Link></div>;
}
