import { SiteShell } from "@/components/layout/site-shell";

const opportunities = [
  {
    title: "I need talent",
    description: "Hire ID-verified interns ready to contribute from day one.",
    action: "Sign up as a Company",
    href: "/signup/company",
  },
  {
    title: "I need placement",
    description: "Get placed with companies around the world.",
    action: "Sign up as a Prospect",
    href: "/signup/intern",
  },
] as const;

export function HomeScreen() {
  return (
    <SiteShell>
      <main className="flex flex-1 items-center">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.025em] sm:text-7xl lg:text-8xl">
            Discover. Develop. <span className="text-accent">Deploy.</span>
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg leading-7 text-zinc-700">
            Skifa connects ID-verified African interns with startups and SMEs
            worldwide.
          </p>

          <div className="mt-16 grid gap-8 sm:mt-10 sm:grid-cols-2">
            {opportunities.map((opportunity) => (
              <section
                key={opportunity.title}
                className="flex min-h-56 flex-col border-2 border-black bg-white p-6 shadow-[4px_5px_0_0_#000] sm:min-h-0 sm:p-8"
              >
                <h2 className="font-display text-3xl font-bold leading-tight">
                  {opportunity.title}
                </h2>
                <p className="mt-2 text-balance leading-6 text-zinc-700">
                  {opportunity.description}
                </p>
                <a
                  href={opportunity.href}
                  className="mt-8 inline-flex w-full items-center justify-center border-2 border-black bg-black px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#7c4ce4] sm:w-fit"
                >
                  {opportunity.action}
                </a>
              </section>
            ))}
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
