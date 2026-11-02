import Link from "next/link";
import { interns } from "@/src/data/interns";
import { TalentCard } from "./talent-card";
export function TalentStrip({ count = 4 }: { count?: number }) {
  return (
    <section className="mt-12" aria-label="Talent on Skifa">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Talent on Skifa</h2>
        <Link
          href="/talent"
          className="text-sm font-medium underline underline-offset-4"
        >
          Browse all talent →
        </Link>
      </div>
      <div
        className={
          "grid gap-4 sm:grid-cols-2 " +
          (count === 6 ? "lg:grid-cols-3 xl:grid-cols-6" : "lg:grid-cols-4")
        }
      >
        {interns.slice(0, count).map((person) => (
          <TalentCard key={person.id} person={person} />
        ))}
      </div>
    </section>
  );
}
