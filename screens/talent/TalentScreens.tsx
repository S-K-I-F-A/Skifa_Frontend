"use client";
import Link from "next/link";

import { useState, type ReactNode } from "react";
import { ShieldIcon } from "@/components/ui/icons";
import { SiteShell } from "@/components/layout/site-shell";
import {
  Badge,
  Modal,
  accentButton,
  useSaved,
} from "@/screens/dashboard/DashboardScreens";
import { FormCard } from "@/components/ui/form-layout";
import {
  Dropdown,
  FormField,
  FormInput,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/ui/form-controls";
import { talent, type Talent } from "./data";
import { TalentPortrait } from "@/components/talent/talent-card";
import { useEntitlements } from "@/lib/use-entitlements";
import { NIGERIAN_STATES } from "@/config/mvp";

function Verified({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center gap-1.5 border-2 border-black bg-white px-2 py-1 text-xs font-bold shadow-hard">
      <ShieldIcon className="size-3.5" /> Verified
    </span>
  ) : (
    <span className="inline-flex items-center rounded-sm border-2 border-dashed border-black px-2 py-1 text-xs font-medium text-muted-foreground">
      Unverified
    </span>
  );
}
const Portrait = TalentPortrait;
export function TalentDirectory() {
  const entitlement = useEntitlements();
  const savedCompany = JSON.parse(useSaved("skifa-company", "{}"));
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState("");
  const [state, setState] = useState("");
  const [level, setLevel] = useState("");
  const [experience, setExperience] = useState("");
  const [verified, setVerified] = useState("all");
  const [availability, setAvailability] = useState<string[]>([]);
  const [stipend, setStipend] = useState(600);
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const filtered = talent
    .filter(
      (person) =>
        (!query ||
          `${person.name} ${person.headline} ${person.skills.map((skill) => skill.name).join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase())) &&
        (!skill ||
          person.skills.some((item) =>
            item.name.toLowerCase().includes(skill.toLowerCase()),
          )) &&
        (!state || person.state === state) &&
        (!level || person.skills.some((skill) => skill.level === level)) &&
        (!experience || person.experience === experience) &&
        (verified !== "verified" || person.idVerified) &&
        (!availability.length || availability.includes(person.availability)) &&
        person.stipend.min <= stipend,
    )
    .sort((a, b) =>
      sort === "newest"
        ? Number(b.idVerified) - Number(a.idVerified) ||
          b.joined.localeCompare(a.joined)
        : sort === "stipend"
          ? a.stipend.min - b.stipend.min
          : Number(b.idVerified) - Number(a.idVerified) ||
            b.joined.localeCompare(a.joined),
    );
  function reset() {
    setQuery("");
    setSkill("");
    setState("");
    setLevel("");
    setExperience("");
    setVerified("all");
    setAvailability([]);
    setStipend(600);
  }
  return (
    <SiteShell>
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8">
          {!entitlement.companyActive ? (
            <div className="flex flex-col gap-4 rounded-md border-2 border-black p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-balance text-sm">
                You&apos;re browsing in preview mode. Create a company account
                to see full profiles and video CVs.
              </p>
              <Link
                href={
                  savedCompany.name
                    ? "/company/profile-preview"
                    : "/signup/company"
                }
                className={`${accentButton} shrink-0`}
              >
                {savedCompany.name
                  ? "Activate account"
                  : "Sign up as a Company"}
              </Link>
            </div>
          ) : null}
          <h1 className="mt-12 text-4xl font-bold sm:text-5xl">
            Browse talent
          </h1>
          <div className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_200px]">
            <div>
              <FormInput
                aria-label="Search talent"
                placeholder="Search by name or skill"
                maxLength={60}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <Dropdown
              aria-label="Sort talent"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="stipend">Lowest stipend</option>
            </Dropdown>
          </div>
          <div className="mt-10 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
            <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
              <div className="space-y-7">
                <FormField label="Skill">
                  <FormInput
                    placeholder="Type a skill, press Enter"
                    maxLength={40}
                    value={skill}
                    onChange={(event) => setSkill(event.target.value)}
                  />
                </FormField>
                {[
                  {
                    label: "State",
                    value: state,
                    update: setState,
                    placeholder: "All states",
                    options: [...NIGERIAN_STATES],
                  },
                  {
                    label: "Skill level",
                    value: level,
                    update: setLevel,
                    placeholder: "Any level",
                    options: ["Beginner", "Intermediate", "Professional"],
                  },
                  {
                    label: "Experience",
                    value: experience,
                    update: setExperience,
                    placeholder: "Any experience",
                    options: [
                      "Less than 6 months",
                      "6-12 months",
                      "1-2 years",
                      "3-5 years",
                      "More than 5 years",
                    ],
                  },
                ].map((filter) => (
                  <FormField key={filter.label} label={filter.label}>
                    <Dropdown
                      value={filter.value}
                      onChange={(event) => filter.update(event.target.value)}
                    >
                      <option value="">{filter.placeholder}</option>
                      {filter.options.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </Dropdown>
                  </FormField>
                ))}
                <FormField label="Verification">
                  <Dropdown
                    value={verified}
                    onChange={(event) => setVerified(event.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="verified">Verified only</option>
                  </Dropdown>
                </FormField>
                <fieldset>
                  <legend className="mb-2 text-sm font-medium">
                    Availability
                  </legend>
                  <div className="space-y-2">
                    {["Full-time", "Part-time", "Remote only"].map((value) => (
                      <label
                        className="flex items-center gap-2 text-sm"
                        key={value}
                      >
                        <input
                          type="checkbox"
                          className="size-4 accent-black"
                          checked={availability.includes(value)}
                          onChange={() =>
                            setAvailability(
                              availability.includes(value)
                                ? availability.filter((item) => item !== value)
                                : [...availability, value],
                            )
                          }
                        />
                        {value}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <FormField label={`Monthly stipend: up to $${stipend}`}>
                  <input
                    aria-label="Maximum monthly stipend"
                    type="range"
                    min={100}
                    max={600}
                    step={25}
                    value={stipend}
                    onChange={(event) => setStipend(Number(event.target.value))}
                    className="w-full accent-black"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$100</span>
                    <span>${stipend}</span>
                  </div>
                </FormField>
              </div>
            </aside>
            <section>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className={`${secondaryButtonClass} lg:hidden`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  ☷ Filters
                </button>
                <p className="text-sm font-medium">
                  {filtered.length}{" "}
                  {filtered.length === 1 ? "intern" : "interns"}
                </p>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((person) => (
                  <a
                    href={`/talent/${person.id}`}
                    key={person.id}
                    className="flex flex-col gap-3 rounded-md border-2 border-black bg-white p-4 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard"
                  >
                    <Portrait person={person} />
                    <div className="min-w-0">
                      <p className="truncate font-display text-lg font-bold">
                        {person.name}
                      </p>
                      <p className="truncate text-sm">{person.headline}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {person.city}, {person.state}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {person.skills[0].name}
                    </p>
                    <div className="mt-auto flex flex-wrap items-center gap-2">
                      <Verified value={person.idVerified} />
                      <Badge>{person.availability}</Badge>
                    </div>
                  </a>
                ))}
              </div>
              {!filtered.length ? (
                <div className="mt-6 rounded-md border-2 border-dashed border-black p-10 text-center">
                  <h2 className="text-xl font-bold">No interns found</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try changing your search or filters.
                  </p>
                  <button
                    className={`mt-5 ${secondaryButtonClass}`}
                    onClick={reset}
                  >
                    Clear filters
                  </button>
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
function Locked() {
  return (
    <div className="relative rounded-md border-2 border-black p-5">
      <div aria-hidden className="space-y-2 blur-[3px]">
        <div className="h-3 w-11/12 rounded-sm bg-muted-foreground/40" />
        <div className="h-3 w-4/5 rounded-sm bg-muted-foreground/40" />
        <div className="h-3 w-2/3 rounded-sm bg-muted-foreground/40" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm font-medium">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="size-4"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Company accounts only
      </div>
    </div>
  );
}
export function TalentProfile({ person }: { person: Talent }) {
  const [view, setView] = useState("");
  const entitlement = useEntitlements();
  const isCompany = entitlement.companyActive && view !== "visitor";
  const [modal, setModal] = useState(false);
  const [notice, setNotice] = useState("");
  const sections: [string, ReactNode][] = [
    [
      "About",
      <p key="bio" className="text-sm leading-relaxed">
        {person.bio}
      </p>,
    ],
    [
      "Skills",
      <div key="skills" className="flex flex-wrap gap-2">
        {person.skills.map((skill) => (
          <Badge key={skill.name}>
            {skill.name} · {skill.level}
          </Badge>
        ))}
      </div>,
    ],
    [
      "Education",
      person.education.length ? (
        person.education.map((entry) => (
          <div key={entry.school}>
            <p className="font-medium">{entry.school}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {entry.course} · {entry.years}
            </p>
          </div>
        ))
      ) : (
        <p key="self" className="text-sm text-muted-foreground">
          Self-taught
        </p>
      ),
    ],
    [
      "Certifications",
      <ul key="certs" className="space-y-2 text-sm">
        {person.certifications.length ? (
          person.certifications.map((cert) => <li key={cert}>{cert}</li>)
        ) : (
          <li className="text-muted-foreground">No certifications added.</li>
        )}
      </ul>,
    ],
    [
      "Work samples",
      <ul key="links" className="space-y-2 text-sm">
        {person.workSamples.length ? (
          person.workSamples.map((link) => (
            <li key={link}>
              <a
                className="break-all font-medium underline underline-offset-4"
                href={link}
                target="_blank"
                rel="noreferrer"
              >
                {link} ↗
              </a>
            </li>
          ))
        ) : (
          <li className="text-muted-foreground">No work samples added.</li>
        )}
      </ul>,
    ],
    [
      "Video CV (Pro)",
      <div
        key="video"
        className="grid aspect-video place-items-center rounded-md border-2 border-black bg-muted"
      >
        <div className="text-center">
          <span className="text-4xl" aria-hidden>
            ▣
          </span>
          <p className="mt-2 text-sm text-muted-foreground">
            Profile video is locked · Pro
          </p>
        </div>
      </div>,
    ],
  ];
  return (
    <SiteShell>
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-5xl px-5 pb-16 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/talent"
              className="text-sm font-medium underline-offset-4 hover:underline"
            >
              ← All talent
            </Link>
            <div className="flex items-center gap-2 rounded-md border-2 border-dashed border-black p-1.5">
              <span className="px-1 text-xs text-muted-foreground">
                View as (temporary):
              </span>
              {["visitor", "company"].map((value) => (
                <button
                  key={value}
                  className={`rounded-sm border-2 px-2.5 py-1 text-xs font-medium capitalize ${isCompany === (value === "company") ? "border-black bg-black text-white" : "border-transparent"}`}
                  disabled={value === "company" && !entitlement.companyActive}
                  onClick={() => setView(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0">
              <FormCard>
                <div className="flex flex-col gap-5 sm:flex-row">
                  <Portrait
                    person={person}
                    className="max-w-[180px] shrink-0"
                  />
                  <div className="min-w-0">
                    <h1 className="text-3xl font-bold sm:text-4xl">
                      {person.name}
                    </h1>
                    <p className="mt-1 font-medium">{person.headline}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {person.city}, {person.state} · {person.experience}{" "}
                      experience
                    </p>
                    <div className="mt-3">
                      <Verified value={person.idVerified} />
                    </div>
                  </div>
                </div>
              </FormCard>
              <div className="mt-12 space-y-10">
                {sections.map(([title, content]) => (
                  <section key={title}>
                    <h2 className="mb-3 text-xl font-bold">{title}</h2>
                    {title === "Video CV (Pro)" ? (
                      <div className="rounded-md border-2 border-black p-5">
                        <p className="font-medium">Video CV (Pro)</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Locked Pro video placeholder
                        </p>
                      </div>
                    ) : isCompany ? (
                      content
                    ) : (
                      <Locked />
                    )}
                  </section>
                ))}
              </div>
            </div>
            <aside>
              <div className="border-2 border-black bg-accent p-6 text-white shadow-hard lg:sticky lg:top-8">
                <h2 className="text-xl font-bold">
                  Hire {person.name.split(" ")[0]}
                </h2>
                <p className="mt-2 text-sm opacity-90">
                  {isCompany
                    ? `Expected monthly stipend: $${person.stipend.min}–$${person.stipend.max}.`
                    : "Create a company account to see the full profile and start a placement."}
                </p>
                {isCompany ? (
                  <button
                    className="mt-5 inline-flex w-full items-center justify-center rounded-md border-2 border-white px-4 py-2.5 text-sm font-medium"
                    onClick={() => setModal(true)}
                  >
                    Request placement
                  </button>
                ) : (
                  <Link
                    className="mt-5 inline-flex w-full items-center justify-center rounded-md border-2 border-white px-4 py-2.5 text-sm font-medium"
                    href="/signup/company"
                  >
                    Sign up as a Company
                  </Link>
                )}
              </div>
            </aside>
          </div>
          {notice ? (
            <p
              role="status"
              className="mt-6 rounded-md border-2 border-black p-4"
            >
              {notice}
            </p>
          ) : null}
        </div>
      </main>
      {modal ? (
        <Modal title="Request placement" onClose={() => setModal(false)}>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              setModal(false);
              setNotice(`Placement request sent for ${person.name}.`);
            }}
          >
            <FormField label="Role">
              <FormInput required placeholder="Frontend intern" />
            </FormField>
            <FormField label="Start date">
              <FormInput required type="date" />
            </FormField>
            <FormField label="Monthly stipend (USD)">
              <FormInput
                type="number"
                required
                min={person.stipend.min}
                defaultValue={person.stipend.min}
              />
            </FormField>
            <button className={`w-full ${primaryButtonClass}`}>
              Request placement
            </button>
          </form>
        </Modal>
      ) : null}
    </SiteShell>
  );
}
