import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const controlClass =
  "h-11 w-full rounded-sm border-2 border-black bg-white px-3 py-2.5 font-sans text-sm text-black outline-none transition-shadow placeholder:text-zinc-500 focus:shadow-[3px_3px_0_#000] disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500";

export function FormField({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-black">{label}</span>
      {children}
      {hint ? <span className="block text-sm text-zinc-500">{hint}</span> : null}
    </label>
  );
}

export function FormInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${controlClass} ${className}`} {...props} />;
}

export function FormTextarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${controlClass} min-h-32 resize-y py-3 ${className}`} {...props} />;
}

export function Dropdown({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block">
      <select className={`${controlClass} cursor-pointer appearance-none pr-10 ${className}`} {...props}>
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2"
      >
        <path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export const primaryButtonClass =
  "inline-flex h-12 items-center justify-center rounded-sm border-2 border-black bg-black px-5 py-3 font-sans text-sm font-medium text-white transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#000] focus-visible:outline-none focus-visible:shadow-[3px_3px_0_#000] disabled:cursor-not-allowed disabled:opacity-50";

export const secondaryButtonClass =
  "inline-flex h-12 items-center justify-center rounded-sm border-2 border-black bg-white px-5 py-3 font-sans text-sm font-medium text-black transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#000] focus-visible:outline-none focus-visible:shadow-[3px_3px_0_#000]";
