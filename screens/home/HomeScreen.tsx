import { TalentStrip } from "@/components/talent/talent-strip";
import { SiteShell } from "@/components/layout/site-shell";

const opportunities = [
  {
    title: "I need talent",
    description: "Find ID-verified interns ready to contribute from day one.",
    action: "Sign up as a Company",
    href: "/signup/company",
  },
  {
    title: "I need placement",
    description: "Get placed with companies across Nigeria.",
    action: "Sign up as a Prospect",
    href: "/signup/intern",
  },
] as const;

export function HomeScreen() {
  return (
    <SiteShell>
      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-16 sm:px-8 sm:py-24">
          <h1 className="font-display text-5xl font-bold leading-[0.95] sm:text-7xl lg:text-8xl">
            Discover. Develop. <span>Deploy.</span>
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg text-muted-foreground">
            Skifa connects ID-verified Nigerian interns with startups and SMEs.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {opportunities.map((opportunity, index) => (
              <section
                key={opportunity.title}
                className="border-2 border-black bg-white p-6 shadow-hard sm:p-8"
              >
                <h2 className="font-display text-3xl font-bold">
                  {opportunity.title}
                </h2>
                <p className="mt-2 text-balance text-muted-foreground">
                  {opportunity.description}
                </p>
                <a
                  href={opportunity.href}
                  className={
                    "mt-8 inline-flex w-full items-center justify-center rounded-sm border-2 border-black px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 sm:w-auto " +
                    (index === 0 ? "bg-accent" : "bg-black")
                  }
                >
                  {opportunity.action}
                </a>
              </section>
            ))}
          </div>
          <TalentStrip count={4} />
        </div>
      </main>
    </SiteShell>
  );
}
