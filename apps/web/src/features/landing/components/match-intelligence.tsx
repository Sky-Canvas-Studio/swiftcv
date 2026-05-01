import { Code2, Gauge, GraduationCap, Layers3, MapPinned, ShieldCheck } from "lucide-react";

const scoringAreas = [
  {
    label: "Technical stack",
    score: "96",
    description: "TypeScript, React, Node, APIs, database experience",
    icon: Code2,
  },
  {
    label: "Role seniority",
    score: "88",
    description: "Scope, ownership, leadership, production experience",
    icon: Layers3,
  },
  {
    label: "Location fit",
    score: "91",
    description: "Remote policy, timezone overlap, relocation preference",
    icon: MapPinned,
  },
  {
    label: "Interview readiness",
    score: "82",
    description: "Likely questions, weak spots, and prep material",
    icon: GraduationCap,
  },
];

export const MatchIntelligence = () => {
  return (
    <section id="matching" className="border-b py-20 md:py-24">
      <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-medium text-muted-foreground">
            <Gauge className="size-4 text-primary" />
            Match intelligence
          </div>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Matching scores should explain the opportunity, not hide it.
          </h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">
            SwiftCV surfaces the reasoning behind recommendations so candidates
            can compare jobs by skill fit, seniority, location, compensation
            signals, and interview readiness.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["Less spray-and-pray", "Better resume targeting", "Clearer interview prep", "Higher-quality shortlist"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="size-4 text-primary" />
                  <span>{item}</span>
                </div>
              )
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-xl shadow-emerald-950/10 dark:shadow-black/30 md:p-6">
          <div className="mb-5 flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-bold">Match score breakdown</p>
              <p className="text-sm text-muted-foreground">
                Example for a senior frontend role
              </p>
            </div>
            <div className="rounded-lg bg-primary px-3 py-2 text-lg font-bold text-primary-foreground">
              94
            </div>
          </div>

          <div className="space-y-4">
            {scoringAreas.map((area) => {
              const Icon = area.icon;

              return (
                <div key={area.label} className="rounded-lg border bg-background/70 p-4">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{area.label}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {area.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {area.score}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${area.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
