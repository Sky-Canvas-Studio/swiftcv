import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  FileText,
  MapPin,
  Sparkles,
  Target,
} from "lucide-react";

const matchSignals = [
  { label: "React + TypeScript", value: "96%" },
  { label: "Remote timezone fit", value: "91%" },
  { label: "Senior frontend scope", value: "88%" },
];

const jobRows = [
  {
    role: "Senior Full Stack Engineer",
    company: "Fintech platform",
    location: "Remote, EU/Asia overlap",
    score: "94",
  },
  {
    role: "Frontend Platform Developer",
    company: "Developer tools company",
    location: "Remote worldwide",
    score: "89",
  },
  {
    role: "AI Product Engineer",
    company: "Applied AI startup",
    location: "Hybrid or remote",
    score: "83",
  },
];

export const Hero = () => {
  return (
    <section className="relative overflow-hidden border-b bg-[linear-gradient(135deg,hsl(160_55%_98%),hsl(180_50%_96%)_45%,hsl(0_0%_100%))] py-16 dark:bg-[linear-gradient(135deg,hsl(174_50%_10%),hsl(170_42%_8%)_50%,hsl(190_35%_9%))] md:py-24">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto grid max-w-full items-center gap-12 px-4 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="min-w-0 w-full max-w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-bottom-4 duration-700 sm:max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-lg border bg-background/80 px-3 py-2 text-sm font-medium text-muted-foreground shadow-sm">
            <Sparkles className="size-4 text-primary" />
            AI job matching for global tech careers
          </div>

          <h1 className="w-full max-w-[calc(100vw-2rem)] text-3xl font-bold leading-tight sm:max-w-4xl sm:text-5xl md:text-6xl">
            Find better-matching tech jobs and apply with a stronger resume.
          </h1>

          <p className="mt-6 w-full max-w-[calc(100vw-2rem)] text-base leading-8 text-muted-foreground sm:max-w-2xl sm:text-lg">
            SwiftCV turns your resume profile into ranked job recommendations,
            match scores, AI interview questions, and custom resumes tailored to
            each role.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" className="h-12 w-full px-6 text-base sm:w-auto">
                Start matching jobs <ArrowRight className="size-4" />
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full px-6 text-base sm:w-auto"
              >
                See features
              </Button>
            </a>
          </div>

          <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            {[
              "Built for software roles",
              "Global and remote jobs",
              "Resume + interview AI",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-w-0 w-full max-w-[calc(100vw-2rem)] animate-in fade-in zoom-in-95 duration-700 lg:max-w-none">
          <div className="w-full max-w-full overflow-hidden rounded-lg border bg-card shadow-2xl shadow-emerald-950/10 dark:shadow-black/30">
            <div className="flex flex-col items-start gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold">SwiftCV Match Board</p>
                <p className="text-xs text-muted-foreground">
                  Profile-based job intelligence
                </p>
              </div>
              <div className="shrink-0 rounded-lg bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                94% top match
              </div>
            </div>

            <div className="grid gap-4 p-4 md:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-4">
                <div className="rounded-lg border bg-background/70 p-4">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="size-5" />
                    </div>
                      <div className="min-w-0">
                        <p className="font-semibold">Khalid's profile</p>
                        <p className="text-xs text-muted-foreground">
                          Full stack TypeScript developer
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {matchSignals.map((signal) => (
                      <div key={signal.label}>
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            {signal.label}
                          </span>
                          <span className="font-semibold">{signal.value}</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: signal.value }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-background/70 p-3">
                    <Brain className="mb-3 size-5 text-primary" />
                    <p className="text-xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">
                      Interview questions
                    </p>
                  </div>
                  <div className="rounded-lg border bg-background/70 p-3">
                    <Target className="mb-3 size-5 text-primary" />
                    <p className="text-xl font-bold">3</p>
                    <p className="text-xs text-muted-foreground">
                      Resume variants
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {jobRows.map((job) => (
                  <div
                    key={job.role}
                    className="min-w-0 rounded-lg border bg-background/70 p-4 transition-colors hover:border-primary/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold">{job.role}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {job.company}
                        </p>
                      </div>
                      <div className="rounded-lg bg-primary px-2.5 py-1 text-sm font-bold text-primary-foreground">
                        {job.score}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="size-3.5" />
                      {job.location}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
