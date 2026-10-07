import type { ReactNode } from "react";

export function FormCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md border-2 border-black bg-white p-6 sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

export function FormHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold leading-9 text-black">
        {title}
      </h1>
      <p className="mt-1 text-sm text-zinc-600">{subtitle}</p>
    </div>
  );
}
