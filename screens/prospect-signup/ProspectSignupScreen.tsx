"use client";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
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
import {
  NIGERIAN_STATES,
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  EXPERIENCE_OPTIONS,
  type Skill,
} from "@/config/mvp";
import { savePreview } from "@/lib/preview-store";
import {
  errorMessage,
  requestConfirmation,
  startCheckout,
} from "@/lib/backend";

const titles = [
  "Create your account",
  "Personal info",
  "Your education",
  "Skills & availability",
  "Certifications & work samples",
  "Review your profile",
  "Pay to Make Profile Visible",
];
const subtitles = [
  "Let's get you started — it only takes a few minutes.",
  "Tell companies about yourself and your skills.",
  "Formal or self-taught — every path counts.",
  "Choose your skills, experience and availability.",
  "Show your proof of work.",
  "Check your details before making your profile visible.",
  "Make your profile visible to companies looking for interns.",
];
type Entry = Record<string, string>;
function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        "rounded-sm border-2 border-black px-4 py-2.5 text-sm font-medium " +
        (active ? "bg-black text-white" : "bg-white hover:bg-muted")
      }
    >
      {children}
    </button>
  );
}
export function ProspectSignupScreen() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Entry>({
    phone: "+234",
    state: "",
    city: "",
    category: "Tech",
    experience: "",
    availability: "Immediately",
    stipendMin: "200",
    stipendMax: "500",
  });
  const [errors, setErrors] = useState<Entry>({});
  const [headshot, setHeadshot] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const [bodyPhoto, setBodyPhoto] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const [selfTaught, setSelfTaught] = useState(false);
  const [education, setEducation] = useState<Entry[]>([
    { school: "", program: "", year: "" },
  ]);
  const [certs, setCerts] = useState<Entry[]>([
    { name: "", issuer: "", year: "" },
  ]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [search, setSearch] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [samples, setSamples] = useState([""]);
  const [complete, setComplete] = useState(false);
  const [visible, setVisible] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(
    () => () => {
      if (headshot) URL.revokeObjectURL(headshot.url);
    },
    [headshot],
  );
  useEffect(
    () => () => {
      if (bodyPhoto) URL.revokeObjectURL(bodyPhoto.url);
    },
    [bodyPhoto],
  );
  const update = (key: string, value: string) =>
    setData((current) => ({ ...current, [key]: value }));
  function validate() {
    const result: Entry = {};
    if (step === 0) {
      if ((data.fullName || "").trim().length < 2)
        result.fullName = "Please enter your full name.";
      if (!/^\S+@\S+\.\S+$/.test(data.email || ""))
        result.email = "Enter a valid email address.";
      if ((data.password || "").length < 8)
        result.password = "Use at least 8 characters.";
      if (
        !NIGERIAN_STATES.includes(
          data.state as (typeof NIGERIAN_STATES)[number],
        )
      )
        result.state = "Select a Nigerian state.";
      if (!data.city.trim()) result.city = "Enter your city.";
    }
    if (step === 1) {
      if (!headshot) result.headshot = "Add a professional headshot.";
      if ((data.headline || "").trim().length < 4)
        result.headline = "Add a short professional headline.";
      if ((data.bio || "").trim().length < 20)
        result.bio = "Tell us about yourself in at least 20 characters.";
      if (!/^\+234\d{10}$/.test(data.phone.replace(/[\s()-]/g, "")))
        result.phone = "Use +234 followed by your 10-digit phone number.";
    }
    if (
      step === 2 &&
      !selfTaught &&
      !education.some((entry) => entry.school.trim())
    )
      result.education = "Add a school/academy or choose self-taught.";
    if (step === 3) {
      if (!skills.length) result.skills = "Choose at least one skill.";
      if (!data.experience) result.experience = "Choose your experience.";
      if (
        !data.stipendMin ||
        !data.stipendMax ||
        Number(data.stipendMin) > Number(data.stipendMax)
      )
        result.stipend = "Enter a minimum no higher than the maximum.";
    }
    if (
      step === 4 &&
      samples.some(
        (sample) => sample.trim() && !/^https?:\/\/\S+$/.test(sample),
      )
    )
      result.samples = "Use complete https:// or http:// work sample links.";
    setErrors(result);
    return !Object.keys(result).length;
  }
  function move(next: number) {
    setErrors({});
    setNotice("");
    setStep(next);
    window.scrollTo({ top: 0 });
  }
  function saveProfile(isVisible: boolean) {
    savePreview("skifa-intern", {
      fullName: data.fullName,
      email: data.email,
      headline: data.headline,
      bio: data.bio,
      state: data.state,
      city: data.city,
      country: "Nigeria",
      phone: data.phone,
      skill: skills[0]?.name,
      skills,
      experience: data.experience,
      availability: data.availability,
      visible: isVisible,
      headshotName: headshot?.name,
      fullBodyName: bodyPhoto?.name,
      education: selfTaught ? [] : education,
      certifications: certs,
      workSamples: samples.filter(Boolean),
    });
    setVisible(isVisible);
  }
  async function finishLater() {
    saveProfile(false);
    setComplete(true);
    window.scrollTo({ top: 0 });
  }
  async function pay() {
    setBusy(true);
    setNotice("");
    saveProfile(false);
    try {
      await startCheckout("profile_visibility");
    } catch (error) {
      setNotice(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  async function resend() {
    setBusy(true);
    setNotice("");
    try {
      const response = await requestConfirmation(data.email);
      setEmailSent(response.sent);
      setNotice(
        response.sent
          ? "Confirmation email sent."
          : "Email delivery is pending.",
      );
    } catch (error) {
      setNotice(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  function field(
    key: string,
    label: string,
    placeholder = "",
    type = "text",
    maxLength = 100,
  ) {
    return (
      <FormField key={key} label={label}>
        {key === "bio" ? (
          <FormTextarea
            value={data[key] || ""}
            maxLength={500}
            placeholder={placeholder}
            onChange={(event) => update(key, event.target.value)}
            aria-invalid={!!errors[key]}
          />
        ) : (
          <FormInput
            value={data[key] || ""}
            maxLength={maxLength}
            type={type}
            placeholder={placeholder}
            onChange={(event) => update(key, event.target.value)}
            aria-invalid={!!errors[key]}
          />
        )}
        {errors[key] ? (
          <p role="alert" className="mt-1.5 text-sm font-medium">
            {errors[key]}
          </p>
        ) : null}
      </FormField>
    );
  }
  function addSkill(name: string) {
    const value = name.trim();
    if (value.length < 2) return;
    if (
      !skills.some((skill) => skill.name.toLowerCase() === value.toLowerCase())
    )
      setSkills([...skills, { name: value, level: "Beginner" }]);
    setSearch("");
  }
  function media(
    label: string,
    photo: { name: string; url: string } | null,
    setPhoto: (photo: { name: string; url: string }) => void,
    required = false,
  ) {
    return (
      <div>
        <p className="mb-2 text-sm font-medium">{label}</p>
        <label className="flex cursor-pointer items-center gap-4 rounded-md border-2 border-dashed border-black p-4">
          {photo ? (
            <span
              role="img"
              aria-label={label + " preview"}
              className="size-20 shrink-0 rounded-sm border-2 border-black bg-cover bg-center"
              style={{ backgroundImage: "url(" + photo.url + ")" }}
            />
          ) : (
            <span
              className="grid size-20 shrink-0 place-items-center rounded-sm border-2 border-black text-3xl"
              aria-hidden
            >
              ↑
            </span>
          )}
          <span className="text-sm">
            <span className="font-medium">
              {photo ? photo.name : "Upload photo"}
            </span>
            <span className="mt-1 block text-muted-foreground">
              PNG or JPG, up to 2 MB
            </span>
          </span>
          <input
            aria-label={label}
            type="file"
            accept="image/png,image/jpeg"
            className="sr-only"
            required={required}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              if (
                file.size > 2e6 ||
                !["image/png", "image/jpeg"].includes(file.type)
              ) {
                setErrors((current) => ({
                  ...current,
                  headshot: "Choose a PNG or JPG up to 2 MB.",
                }));
                return;
              }
              setErrors((current) => ({ ...current, headshot: "" }));
              setPhoto({ name: file.name, url: URL.createObjectURL(file) });
            }}
          />
        </label>
      </div>
    );
  }
  const matches = SKILL_CATEGORIES[data.category].filter((name) =>
    name.toLowerCase().includes(search.toLowerCase()),
  );
  const reviewRows: [string, string, number][] = [
    [
      "Account",
      [data.fullName, data.email, data.city + ", " + data.state].join(" · "),
      0,
    ],
    [
      "Personal info",
      [data.headline, data.bio, headshot?.name].filter(Boolean).join(" · "),
      1,
    ],
    [
      "Education",
      selfTaught
        ? "Self-taught"
        : education
            .map((item) =>
              [item.school, item.program, item.year].filter(Boolean).join(", "),
            )
            .join("; "),
      2,
    ],
    [
      "Skills & availability",
      skills.map((skill) => skill.name + " (" + skill.level + ")").join(", ") +
        " · " +
        data.experience +
        " · " +
        data.availability +
        " · $" +
        data.stipendMin +
        "–$" +
        data.stipendMax +
        "/month",
      3,
    ],
    [
      "Certifications & work samples",
      certs
        .map((cert) => cert.name)
        .filter(Boolean)
        .concat(files, samples.filter(Boolean))
        .join(", ") || "No entries added",
      4,
    ],
  ];
  return (
    <SiteShell tone="muted" showFooter={false}>
      <main className="mx-auto w-full max-w-2xl px-5 pb-20 pt-4 sm:px-8">
        {complete ? (
          <FormCard className="text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full border-2 border-black text-2xl">
              ✓
            </div>
            <h1 className="mt-6 text-4xl font-bold">Profile saved</h1>
            <p className="mt-3 font-medium">
              {visible
                ? "Your profile is visible to companies."
                : "Your profile is not visible yet. You can pay later from your dashboard."}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {emailSent
                ? "We've sent a confirmation email with your next steps."
                : "Confirmation email is pending — email delivery is not connected yet."}
            </p>
            <button
              className="mt-3 text-sm font-medium underline underline-offset-4 disabled:opacity-50"
              disabled={busy}
              onClick={resend}
            >
              Resend email
            </button>
            <div>
              <Link
                href="/intern/dashboard"
                className={"mt-8 " + primaryButtonClass + " !bg-accent"}
              >
                Go to dashboard
              </Link>
            </div>
          </FormCard>
        ) : (
          <>
            <div className="mb-6">
              <div className="mb-2 flex justify-between text-sm font-medium">
                <span>Step {step + 1} of 7</span>
                <span className="text-muted-foreground">
                  {Math.round(((step + 1) / 7) * 100)}%
                </span>
              </div>
              <div className="h-3 rounded-sm border-2 border-black">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: ((step + 1) / 7) * 100 + "%" }}
                />
              </div>
            </div>
            <FormCard>
              <h1 className="text-3xl font-bold sm:text-4xl">{titles[step]}</h1>
              <p className="mt-2 text-muted-foreground">{subtitles[step]}</p>
              <div className="mt-8 space-y-5">
                {step === 0 ? (
                  <>
                    {field("fullName", "Full name", "Amara Okafor")}
                    {field("email", "Email", "amara@example.com", "email", 255)}
                    {field(
                      "password",
                      "Password",
                      "At least 8 characters",
                      "password",
                    )}
                    <FormField label="Nigerian state">
                      <Dropdown
                        value={data.state}
                        onChange={(event) =>
                          update("state", event.target.value)
                        }
                      >
                        <option value="">Select state</option>
                        {NIGERIAN_STATES.map((state) => (
                          <option key={state}>{state}</option>
                        ))}
                      </Dropdown>
                      {errors.state ? (
                        <p role="alert" className="mt-1 text-sm">
                          {errors.state}
                        </p>
                      ) : null}
                    </FormField>
                    {field("city", "City", "Lagos")}
                  </>
                ) : null}
                {step === 1 ? (
                  <>
                    {media(
                      "Professional headshot (required)",
                      headshot,
                      setHeadshot,
                      true,
                    )}
                    {errors.headshot ? (
                      <p role="alert" className="text-sm">
                        {errors.headshot}
                      </p>
                    ) : null}
                    {field("headline", "Headline", "Frontend intern")}
                    {field(
                      "bio",
                      "About Me (Tell us about yourself and your skills.)",
                      "Tell companies about yourself and your skills.",
                    )}
                    {field("phone", "Phone", "+234", "tel", 20)}
                    {media(
                      "Full-body photo (optional)",
                      bodyPhoto,
                      setBodyPhoto,
                    )}
                    <div className="rounded-md border-2 border-dashed border-black p-5">
                      <p className="font-medium">Profile video (Pro)</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Locked. Upgrade to Pro after creating your profile.
                      </p>
                    </div>
                  </>
                ) : null}
                {step === 2 ? (
                  <>
                    <label className="flex items-center gap-3 text-sm font-medium">
                      <input
                        type="checkbox"
                        className="size-5 accent-black"
                        checked={selfTaught}
                        onChange={(event) =>
                          setSelfTaught(event.target.checked)
                        }
                      />
                      I&apos;m self-taught
                    </label>
                    {!selfTaught ? (
                      <>
                        {education.map((entry, index) => (
                          <div
                            key={index}
                            className="space-y-4 rounded-md border-2 border-black p-5"
                          >
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">
                                Entry {index + 1}
                              </span>
                              {education.length > 1 ? (
                                <button
                                  onClick={() =>
                                    setEducation(
                                      education.filter((_, i) => i !== index),
                                    )
                                  }
                                  className="underline"
                                >
                                  Remove
                                </button>
                              ) : null}
                            </div>
                            {[
                              [
                                "school",
                                "School/Academy (Where did you learn this skill?)",
                                "University of Lagos",
                              ],
                              ["program", "Program", "Computer Science"],
                              ["year", "Graduation year", "2025"],
                            ].map(([key, label, placeholder]) => (
                              <FormField key={key} label={label}>
                                <FormInput
                                  value={entry[key]}
                                  placeholder={placeholder}
                                  maxLength={key === "year" ? 4 : 100}
                                  onChange={(event) =>
                                    setEducation(
                                      education.map((item, i) =>
                                        i === index
                                          ? {
                                              ...item,
                                              [key]: event.target.value,
                                            }
                                          : item,
                                      ),
                                    )
                                  }
                                />
                              </FormField>
                            ))}
                          </div>
                        ))}
                        <button
                          onClick={() =>
                            setEducation([
                              ...education,
                              { school: "", program: "", year: "" },
                            ])
                          }
                          className="text-sm font-medium underline underline-offset-4"
                        >
                          + Add another
                        </button>
                      </>
                    ) : null}
                    {errors.education ? (
                      <p role="alert" className="text-sm">
                        {errors.education}
                      </p>
                    ) : null}
                  </>
                ) : null}
                {step === 3 ? (
                  <>
                    <FormField label="Category">
                      <Dropdown
                        value={data.category}
                        onChange={(event) => {
                          update("category", event.target.value);
                          setSearch("");
                        }}
                      >
                        {Object.keys(SKILL_CATEGORIES).map((category) => (
                          <option key={category}>{category}</option>
                        ))}
                      </Dropdown>
                    </FormField>
                    <FormField label="Search skills">
                      <FormInput
                        placeholder="Search or enter a custom skill"
                        value={search}
                        maxLength={80}
                        onChange={(event) => setSearch(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addSkill(search);
                          }
                        }}
                      />
                    </FormField>
                    <div className="flex flex-wrap gap-2">
                      {matches.map((name) => (
                        <Choice
                          key={name}
                          active={skills.some((skill) => skill.name === name)}
                          onClick={() => addSkill(name)}
                        >
                          {name}
                        </Choice>
                      ))}
                    </div>
                    {search.trim().length >= 2 &&
                    !skills.some(
                      (skill) =>
                        skill.name.toLowerCase() ===
                        search.trim().toLowerCase(),
                    ) ? (
                      <button
                        className="text-sm font-medium underline underline-offset-4"
                        onClick={() => addSkill(search)}
                      >
                        + Add custom skill: {search.trim()}
                      </button>
                    ) : null}
                    {skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="grid gap-3 rounded-md border-2 border-black p-4 sm:grid-cols-[1fr_180px_auto] sm:items-center"
                      >
                        <span className="text-sm font-medium">
                          {skill.name}
                        </span>
                        <Dropdown
                          aria-label={skill.name + " level"}
                          value={skill.level}
                          onChange={(event) =>
                            setSkills(
                              skills.map((item) =>
                                item.name === skill.name
                                  ? {
                                      ...item,
                                      level: event.target
                                        .value as Skill["level"],
                                    }
                                  : item,
                              ),
                            )
                          }
                        >
                          {SKILL_LEVELS.map((level) => (
                            <option key={level}>{level}</option>
                          ))}
                        </Dropdown>
                        <button
                          aria-label={"Remove " + skill.name}
                          className="text-sm underline"
                          onClick={() =>
                            setSkills(
                              skills.filter((item) => item.name !== skill.name),
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {errors.skills ? (
                      <p role="alert" className="text-sm">
                        {errors.skills}
                      </p>
                    ) : null}
                    <FormField label="Experience">
                      <Dropdown
                        value={data.experience}
                        onChange={(event) =>
                          update("experience", event.target.value)
                        }
                      >
                        <option value="">Select experience</option>
                        {EXPERIENCE_OPTIONS.map((value) => (
                          <option key={value}>{value}</option>
                        ))}
                      </Dropdown>
                      {errors.experience ? (
                        <p role="alert" className="text-sm">
                          {errors.experience}
                        </p>
                      ) : null}
                    </FormField>
                    <FormField label="Availability">
                      <Dropdown
                        value={data.availability}
                        onChange={(event) =>
                          update("availability", event.target.value)
                        }
                      >
                        {["Immediately", "In 1 month", "Flexible"].map(
                          (value) => (
                            <option key={value}>{value}</option>
                          ),
                        )}
                      </Dropdown>
                    </FormField>
                    <FormField label="Expected Earnings (Make yourself affordable.)">
                      <p className="mb-2 text-xs text-muted-foreground">
                        Monthly earnings in USD
                      </p>
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        <FormInput
                          aria-label="Minimum earnings"
                          type="number"
                          min={0}
                          value={data.stipendMin}
                          onChange={(event) =>
                            update("stipendMin", event.target.value)
                          }
                        />
                        <span>to</span>
                        <FormInput
                          aria-label="Maximum earnings"
                          type="number"
                          min={0}
                          value={data.stipendMax}
                          onChange={(event) =>
                            update("stipendMax", event.target.value)
                          }
                        />
                      </div>
                      {errors.stipend ? (
                        <p role="alert" className="text-sm">
                          {errors.stipend}
                        </p>
                      ) : null}
                    </FormField>
                  </>
                ) : null}
                {step === 4 ? (
                  <>
                    {certs.map((entry, index) => (
                      <div
                        key={index}
                        className="space-y-4 rounded-md border-2 border-black p-5"
                      >
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">
                            Certification {index + 1}
                          </span>
                          {certs.length > 1 ? (
                            <button
                              className="underline"
                              onClick={() =>
                                setCerts(certs.filter((_, i) => i !== index))
                              }
                            >
                              Remove
                            </button>
                          ) : null}
                        </div>
                        {[
                          ["name", "Certification name"],
                          ["issuer", "Issuer"],
                          ["year", "Year"],
                        ].map(([key, label]) => (
                          <FormField key={key} label={label}>
                            <FormInput
                              value={entry[key]}
                              maxLength={key === "year" ? 4 : 100}
                              onChange={(event) =>
                                setCerts(
                                  certs.map((item, i) =>
                                    i === index
                                      ? { ...item, [key]: event.target.value }
                                      : item,
                                  ),
                                )
                              }
                            />
                          </FormField>
                        ))}
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setCerts([...certs, { name: "", issuer: "", year: "" }])
                      }
                      className="text-sm font-medium underline underline-offset-4"
                    >
                      + Add certification
                    </button>
                    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed border-black p-8 text-center">
                      <span className="font-medium">
                        Certificates &amp; accolades
                      </span>
                      <span className="text-sm text-muted-foreground">
                        PDF, JPG or PNG · up to 5 MB each
                      </span>
                      <input
                        aria-label="Certificates & accolades"
                        className="sr-only"
                        type="file"
                        accept=".pdf,image/png,image/jpeg"
                        multiple
                        onChange={(event) => {
                          const selected = Array.from(event.target.files || []);
                          if (selected.some((file) => file.size > 5e6)) {
                            setErrors({
                              files: "Each file must be no larger than 5 MB.",
                            });
                            return;
                          }
                          setFiles([
                            ...files,
                            ...selected.map((file) => file.name),
                          ]);
                        }}
                      />
                    </label>
                    {errors.files ? <p role="alert">{errors.files}</p> : null}
                    {files.map((file, index) => (
                      <p key={index} className="text-sm">
                        {file}
                      </p>
                    ))}
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Work sample links</p>
                      {samples.map((sample, index) => (
                        <FormInput
                          key={index}
                          aria-label={"Work sample " + (index + 1)}
                          type="url"
                          value={sample}
                          placeholder="https://your-portfolio.example"
                          onChange={(event) =>
                            setSamples(
                              samples.map((item, i) =>
                                i === index ? event.target.value : item,
                              ),
                            )
                          }
                        />
                      ))}
                      <button
                        onClick={() => setSamples([...samples, ""])}
                        className="text-sm font-medium underline underline-offset-4"
                      >
                        + Add another link
                      </button>
                      {errors.samples ? (
                        <p role="alert">{errors.samples}</p>
                      ) : null}
                    </div>
                  </>
                ) : null}
                {step === 5 ? (
                  <div className="space-y-4">
                    {reviewRows.map(([label, value, target]) => (
                      <div
                        key={label}
                        className="rounded-md border-2 border-black p-5"
                      >
                        <div className="mb-3 flex justify-between">
                          <h2 className="text-lg font-bold">{label}</h2>
                          <button
                            onClick={() => move(target)}
                            className="text-sm font-medium underline underline-offset-4"
                          >
                            Edit
                          </button>
                        </div>
                        <p className="break-words text-sm text-muted-foreground">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {step === 6 ? (
                  <>
                    <div className="rounded-md border-2 border-black p-5">
                      <p className="text-sm font-medium">
                        Profile visibility fee (one-time)
                      </p>
                      <p className="mt-3 font-display text-3xl font-bold">
                        $1.00
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground">
                        Pay to make your profile visible to companies. Your
                        profile stays private until payment is confirmed.
                      </p>
                    </div>
                    <button
                      disabled={busy}
                      onClick={pay}
                      className={"w-full " + primaryButtonClass}
                    >
                      {busy ? "Connecting…" : "Pay to Make Profile Visible"}
                    </button>
                    <button
                      disabled={busy}
                      onClick={finishLater}
                      className="block w-full text-center text-sm font-medium underline underline-offset-4"
                    >
                      Pay later
                    </button>
                  </>
                ) : null}
              </div>
              <div className="mt-10 flex justify-between gap-4">
                {step > 0 ? (
                  <button
                    onClick={() => move(step - 1)}
                    className={secondaryButtonClass}
                  >
                    ← Back
                  </button>
                ) : (
                  <span />
                )}
                {step < 6 ? (
                  <button
                    className={primaryButtonClass}
                    onClick={() => {
                      if (validate()) move(step + 1);
                    }}
                  >
                    Continue →
                  </button>
                ) : null}
              </div>
            </FormCard>
            {step === 0 ? (
              <p className="mt-6 text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium underline underline-offset-4"
                >
                  Log in
                </Link>
              </p>
            ) : null}
          </>
        )}
        {notice ? (
          <p
            role="status"
            className="mt-5 rounded-md border-2 border-black p-4 text-sm"
          >
            {notice}
          </p>
        ) : null}
      </main>
    </SiteShell>
  );
}
