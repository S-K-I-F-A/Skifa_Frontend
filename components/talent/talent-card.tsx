import Link from "next/link";
import Image from "next/image";
import type { Talent } from "@/src/data/interns";
import { ShieldIcon } from "@/components/ui/icons";
export function TalentPortrait({
  person,
  className = "",
}: {
  person: Talent;
  className?: string;
}) {
  return (
    <div
      className={
        "relative aspect-[4/5] overflow-hidden border-2 border-black bg-muted " +
        className
      }
    >
      {person.photo ? (
        <Image
          src={person.photo}
          alt={person.name + " portrait"}
          fill
          sizes="(max-width:640px) 90vw, 250px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <svg
            aria-hidden
            viewBox="0 0 100 120"
            className="h-3/4 w-3/4 text-black/20"
          >
            <circle cx="50" cy="35" r="22" fill="currentColor" />
            <path
              d="M10 115v-15c0-24 18-39 40-39s40 15 40 39v15"
              fill="currentColor"
            />
          </svg>
          <span className="absolute bottom-3 text-xs text-muted-foreground">
            Photo unavailable
          </span>
        </div>
      )}
    </div>
  );
}
export function TalentCard({ person }: { person: Talent }) {
  return (
    <Link
      href={("/talent/" + person.id) as "/talent/[id]"}
      className="flex min-w-0 flex-col gap-3 rounded-md border-2 border-black bg-white p-4 transition-transform hover:-translate-y-0.5"
    >
      <TalentPortrait person={person} />
      <div className="min-w-0">
        <p className="truncate font-display text-lg font-bold">{person.name}</p>
        <p className="truncate text-sm">{person.headline}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {person.city}, {person.state}
        </p>
      </div>
      <p className="text-sm font-medium">{person.skills[0]?.name}</p>
      <span
        className={
          "mt-auto inline-flex w-fit items-center gap-1 rounded-sm border-2 border-black px-2 py-1 text-xs font-medium " +
          (!person.idVerified ? "border-dashed" : "")
        }
      >
        {person.idVerified ? <ShieldIcon className="size-3.5" /> : null}
        {person.idVerified ? "Verified" : "Unverified"}
      </span>
    </Link>
  );
}
