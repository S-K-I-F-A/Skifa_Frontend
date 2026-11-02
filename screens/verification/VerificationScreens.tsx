"use client";
import Link from "next/link";

import { useEffect, useRef, useState } from "react";
import {
  DashboardShell,
  accentButton,
  useSaved,
} from "@/screens/dashboard/DashboardScreens";
import { uploadVideo, errorMessage } from "@/lib/backend";
import { useEntitlements } from "@/lib/use-entitlements";
import { savePreview } from "@/lib/preview-store";
import { useRouter } from "next/navigation";
import {
  FormField,
  FormInput,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/ui/form-controls";

const statusLabels: Record<string, string> = {
  not_started: "Not started",
  pending: "Pending review",
  verified: "Verified",
  resubmit: "Needs resubmission",
};
export function VerificationStatus() {
  const saved = useSaved("skifa-verification", "pending");
  const [preview, setPreview] = useState("");
  const status = preview || saved;
  const walletPreview = useSaved("skifa-wallet-preview", "inactive");
  return (
    <DashboardShell>
      <div className="mx-auto mt-6 max-w-2xl">
        <h1 className="text-4xl font-bold sm:text-5xl">NIN verification</h1>
        <p className="mt-3 text-muted-foreground">
          We usually review documents within 24 hours. We&apos;ll email you when
          it&apos;s done.
        </p>
        <div
          className={`mt-8 flex items-start gap-4 rounded-md border-2 border-black p-6 ${status === "verified" ? "shadow-hard" : ""}`}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-black text-lg">
            {status === "verified" ? "✓" : status === "pending" ? "◷" : "○"}
          </span>
          <div>
            <h2 className="text-xl font-bold">NIN · Nigeria</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              <strong className="text-black">{statusLabels[status]}</strong>
              {status === "pending" ? " · Submitted today, 15:32" : ""}
            </p>
            {status === "resubmit" ? (
              <>
                <p className="mt-3 text-sm">
                  The back of your NIN slip was blurry.
                </p>
                <Link
                  href="/intern/verify-id"
                  className={`mt-4 ${accentButton}`}
                >
                  Resubmit
                </Link>
              </>
            ) : status === "not_started" ? (
              <Link href="/intern/verify-id" className={`mt-4 ${accentButton}`}>
                Activate Wallet
              </Link>
            ) : null}
          </div>
        </div>
        <Link
          href="/intern/dashboard"
          className={`mt-8 ${secondaryButtonClass}`}
        >
          Back to dashboard
        </Link>
        <fieldset className="mt-12 border-t-2 border-black pt-6">
          <legend className="text-xs text-muted-foreground">
            Preview state (temporary)
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(statusLabels).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setPreview(value);
                  savePreview("skifa-verification", value);
                }}
                className={`rounded-sm border-2 border-black px-3 py-2 text-xs font-medium ${status === value ? "bg-black text-white" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="mt-5 flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="size-5 accent-black"
              checked={walletPreview === "active"}
              onChange={(event) =>
                savePreview(
                  "skifa-wallet-preview",
                  event.target.checked ? "active" : "inactive",
                )
              }
            />
            Wallet activated (temporary preview only)
          </label>
        </fieldset>
      </div>
    </DashboardShell>
  );
}
export function VerifyIdentity() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [nin, setNin] = useState("");
  const [front, setFront] = useState(false);
  const [back, setBack] = useState(false);
  const [selfie, setSelfie] = useState(false);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  function next() {
    setError("");
    if (step === 1 && nin.length !== 11)
      return setError("Enter all 11 digits of your NIN.");
    if (step === 2 && (!front || !back))
      return setError("Add both sides of your NIN slip or card.");
    if (step === 3 && !selfie) return setError("Take a selfie to continue.");
    if (step === 4) {
      if (!consent)
        return setError("Please confirm these documents are yours.");
      sessionStorage.setItem("skifa-verification", "pending");
      router.push("/intern/verification");
      return;
    }
    setStep(step + 1);
  }
  return (
    <DashboardShell>
      <div className="mx-auto mt-6 max-w-2xl">
        <p className="text-sm font-medium">Step {step} of 4</p>
        <div className="mt-2 h-3 rounded-sm border-2 border-black">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${step * 25}%` }}
          />
        </div>
        <section className="mt-10">
          <h1 className="text-3xl font-bold sm:text-4xl">
            {
              [
                "",
                "Activate your wallet",
                "Upload your NIN slip or card",
                "Selfie check",
                "Review & submit",
              ][step]
            }
          </h1>
          <p className="mt-2 text-muted-foreground">
            {
              [
                "",
                "We verify your identity with your NIN before you can receive payments.",
                "Clear photos of the front and back.",
                "We'll match your face to your NIN slip. Good light, no hat or glasses.",
                `NIN ••• ••• •${nin.slice(-3)}`,
              ][step]
            }
          </p>
          {step === 1 ? (
            <div className="mt-8">
              <FormField label="National Identification Number">
                <FormInput
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={11}
                  value={nin}
                  placeholder="0000 0000 000"
                  onChange={(event) =>
                    setNin(event.target.value.replace(/\D/g, "").slice(0, 11))
                  }
                />
                <div className="mt-2 flex items-center justify-between text-sm">
                  <p className="text-muted-foreground">
                    Your 11-digit National Identification Number
                  </p>
                  <p
                    className={`font-medium tabular-nums ${nin.length === 11 ? "" : "text-muted-foreground"}`}
                  >
                    {nin.length}/11
                  </p>
                </div>
              </FormField>
            </div>
          ) : null}
          {step === 2 ? (
            <>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    label: "Front of NIN slip",
                    added: front,
                    update: setFront,
                  },
                  { label: "Back of NIN slip", added: back, update: setBack },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => item.update(true)}
                    className={`flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-black p-4 text-center text-sm ${item.added ? "" : "border-dashed hover:shadow-hard"}`}
                  >
                    <span className="text-2xl">{item.added ? "✓" : "↑"}</span>
                    <span className="font-medium">
                      {item.label}
                      {item.added ? " added" : ""}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.added
                        ? "Tap to replace"
                        : "Tap to upload or drop a file"}
                    </span>
                  </button>
                ))}
              </div>
              <button
                className={`mt-4 w-full sm:w-auto ${secondaryButtonClass}`}
                onClick={() => {
                  setFront(true);
                  setBack(true);
                }}
              >
                ▣ Use camera
              </button>
              <ul className="mt-8 space-y-2 text-sm">
                {[
                  "All four corners visible",
                  "No glare or blur",
                  "JPG, PNG or PDF, up to 10 MB",
                ].map((text) => (
                  <li key={text} className="flex items-center gap-2">
                    <span>✓</span>
                    {text}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {step === 3 ? (
            <>
              <div className="mt-8 grid aspect-[3/4] w-full place-items-center border-2 border-black bg-muted sm:aspect-[4/3]">
                {selfie ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-6xl" aria-hidden>
                      ☻
                    </span>
                    <span className="font-medium">Selfie captured</span>
                  </div>
                ) : (
                  <div className="grid aspect-[3/4] h-[70%] place-items-center rounded-[50%] border-2 border-dashed border-black">
                    <span className="px-4 text-center text-sm text-muted-foreground">
                      Position your face in the oval
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  className={secondaryButtonClass}
                  onClick={() => setSelfie(!selfie)}
                >
                  {selfie ? "Retake" : "▣ Take selfie"}
                </button>
              </div>
            </>
          ) : null}
          {step === 4 ? (
            <>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {["Front", "Back", "Selfie"].map((label) => (
                  <div key={label}>
                    <div className="grid aspect-[4/3] place-items-center rounded-md border-2 border-black bg-muted text-3xl">
                      {label === "Selfie" ? "☻" : "↑"}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="font-medium">{label}</span>
                      <button
                        className="underline underline-offset-4"
                        onClick={() => setStep(label === "Selfie" ? 3 : 2)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <label className="mt-8 flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-0.5 size-5 accent-black"
                />
                These documents are mine and valid.
              </label>
            </>
          ) : null}
        </section>
        {error ? (
          <p role="alert" className="mt-6 text-sm font-medium">
            ⚠ {error}
          </p>
        ) : null}
        <div className="mt-10 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              className="rounded-sm border-2 border-transparent px-5 py-3 text-sm font-medium hover:border-black"
              onClick={() => {
                setError("");
                setStep(step - 1);
              }}
            >
              Back
            </button>
          ) : (
            <Link
              href="/intern/dashboard"
              className="text-sm font-medium underline underline-offset-4"
            >
              Cancel
            </Link>
          )}
          <button className={primaryButtonClass} onClick={next}>
            {step === 4 ? "Submit" : "Continue"}
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
export function VideoCV() {
  const entitlement = useEntitlements();
  if (entitlement.pro) return <VideoRecorder />;
  return (
    <DashboardShell>
      <div className="mx-auto mt-6 max-w-3xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Video CV (Pro)</h1>
        <p className="mt-2 text-muted-foreground">
          Video CV is a Pro feature. Upgrade to Pro to record or upload your
          60-second video.
        </p>
        <div className="mt-8 grid aspect-video place-items-center rounded-md border-2 border-black bg-muted">
          <div className="text-center">
            <svg
              aria-label="Pro video locked"
              viewBox="0 0 24 24"
              className="mx-auto size-12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <p className="mt-4 font-medium">
              {entitlement.loading
                ? "Checking Pro access…"
                : "Profile video · Pro"}
            </p>
          </div>
        </div>
        <Link href="/intern/upgrade" className={"mt-6 " + accentButton}>
          Upgrade to Pro
        </Link>
        <Link
          href="/intern/dashboard"
          className="mt-6 block text-sm font-medium underline underline-offset-4"
        >
          Back to dashboard
        </Link>
      </div>
    </DashboardShell>
  );
}
function VideoRecorder() {
  const [mode, setMode] = useState("record");
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  useEffect(() => {
    if (!recording) return;
    const timer = setInterval(
      () =>
        setSeconds((value) => {
          if (value <= 1) {
            recorder.current?.stop();
            return 0;
          }
          return value - 1;
        }),
      1000,
    );
    return () => clearInterval(timer);
  }, [recording]);
  useEffect(
    () => () => {
      stream.current?.getTracks().forEach((track) => track.stop());
    },
    [],
  );
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url],
  );
  async function record() {
    if (recording) {
      recorder.current?.stop();
      return;
    }
    try {
      setError("");
      const media = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      stream.current = media;
      if (video.current) {
        video.current.srcObject = media;
        video.current.muted = true;
        await video.current.play();
      }
      const capture = new MediaRecorder(media);
      recorder.current = capture;
      chunks.current = [];
      capture.ondataavailable = (event) => {
        if (event.data.size) chunks.current.push(event.data);
      };
      capture.onstop = () => {
        setUrl(
          URL.createObjectURL(
            new Blob(chunks.current, { type: capture.mimeType }),
          ),
        );
        setRecording(false);
        media.getTracks().forEach((track) => track.stop());
        if (video.current) {
          video.current.srcObject = null;
          video.current.muted = false;
        }
      };
      setSeconds(60);
      setRecording(true);
      capture.start();
    } catch {
      stream.current?.getTracks().forEach((track) => track.stop());
      setError(
        "Camera access is unavailable. Allow camera and microphone access, or upload a video instead.",
      );
    }
  }
  return (
    <DashboardShell>
      <div className="mx-auto mt-6 max-w-3xl">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Your 60-second video CV
        </h1>
        <p className="mt-2 text-balance text-muted-foreground">
          A short video helps companies get a feel for you. Keep it natural,
          cover these three points.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            [
              "Introduce yourself",
              "Name, where you're based, what you study or build.",
            ],
            [
              "Your strongest skill",
              "One concrete example of something you made.",
            ],
            [
              "What you want to do next",
              "The role or team you'd love to join.",
            ],
          ].map(([title, text], index) => (
            <div key={title} className="rounded-md border-2 border-black p-5">
              <p className="font-display text-sm font-bold">0{index + 1}</p>
              <h2 className="mt-2 font-sans text-base font-medium">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex gap-2" role="tablist">
          {["record", "upload"].map((value) => (
            <button
              key={value}
              role="tab"
              aria-selected={mode === value}
              onClick={() => {
                if (!recording) setMode(value);
              }}
              className={`rounded-sm border-2 px-4 py-2 text-sm font-medium capitalize ${mode === value ? "border-black bg-black text-white" : "border-transparent hover:border-black"}`}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="mt-6">
          <div className="relative grid aspect-video place-items-center border-2 border-black bg-muted">
            <video
              ref={video}
              src={url || undefined}
              controls={!!url}
              playsInline
              className={`h-full w-full object-cover ${url || recording ? "" : "hidden"}`}
            />
            {!url && !recording ? (
              <div className="text-center">
                <svg
                  aria-hidden
                  className="size-10 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="6" width="14" height="12" rx="2" />
                  <path d="m16 10 6-4v14l-6-4" />
                </svg>
              </div>
            ) : null}
            <span className="absolute right-3 top-3 rounded-sm border-2 border-black bg-white px-2 py-0.5 font-display text-lg font-bold tabular-nums">
              0:{String(seconds).padStart(2, "0")}
            </span>
            {recording ? (
              <span className="absolute left-3 top-3 rounded-sm border-2 border-black bg-white px-2 py-0.5 text-xs">
                ● Recording
              </span>
            ) : null}
          </div>
          <div className="mt-4 flex gap-3">
            {mode === "record" ? (
              <button className={primaryButtonClass} onClick={record}>
                {recording ? "Stop" : url ? "Retake" : "▣ Record"}
              </button>
            ) : (
              <label className={`${secondaryButtonClass} cursor-pointer`}>
                Upload video
                <input
                  type="file"
                  accept="video/*"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      setUrl(URL.createObjectURL(file));
                      setSaved(false);
                    }
                  }}
                />
              </label>
            )}
            {url ? (
              <button
                className={accentButton}
                disabled={saving}
                onClick={async () => {
                  setSaving(true);
                  setError("");
                  try {
                    const clip = await fetch(url).then((response) =>
                      response.blob(),
                    );
                    await uploadVideo(clip);
                    savePreview("skifa-video", "saved");
                    setSaved(true);
                  } catch (error) {
                    setError(errorMessage(error));
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                Save video CV
              </button>
            ) : null}
          </div>
        </div>
        {error ? (
          <p role="alert" className="mt-4 text-sm">
            {error}
          </p>
        ) : null}
        {saved ? (
          <p role="status" className="mt-4 text-sm font-medium">
            Video CV saved
          </p>
        ) : null}
        <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          Companies see a locked thumbnail until they sign up.
        </p>
        <Link
          href="/intern/dashboard"
          className="mt-6 inline-block text-sm font-medium underline underline-offset-4"
        >
          Back to dashboard
        </Link>
      </div>
    </DashboardShell>
  );
}
