import type { CSSProperties, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  BrainCircuit,
  BriefcaseBusiness,
  Cpu,
  DatabaseZap,
  FileText,
  MapPin,
  SearchCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";

const profileSignals = [
  "Resume",
  "Skills",
  "Projects",
  "Location",
  "Salary",
];

const engineSignals = ["AI", "ML", "NLP", "JobLake"];

const outputCards = [
  {
    title: "Senior Full Stack Engineer",
    meta: "Remote worldwide",
    value: "94%",
    icon: BriefcaseBusiness,
  },
  {
    title: "Interview prep generated",
    meta: "12 focused questions",
    value: "AI",
    icon: BrainCircuit,
  },
  {
    title: "Custom resume ready",
    meta: "Role-specific keywords",
    value: "CV",
    icon: FileText,
  },
];

export const Hero = () => {
  return (
    <HeroWrapperBg>
      <HeroTopSection />
      <HeroAnimatedFlow />
    </HeroWrapperBg>
  );
};

function HeroWrapperBg({ children }: { children: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b bg-[radial-gradient(circle_at_50%_8%,hsl(166_62%_91%),transparent_34%),linear-gradient(135deg,hsl(160_55%_98%),hsl(180_50%_96%)_48%,hsl(0_0%_100%))] py-14 dark:bg-[radial-gradient(circle_at_50%_8%,hsl(166_55%_16%),transparent_36%),linear-gradient(135deg,hsl(174_50%_10%),hsl(170_42%_8%)_52%,hsl(190_35%_9%))] md:py-20">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container relative mx-auto flex max-w-full flex-col gap-10 px-4 md:gap-12">
        {children}
      </div>
    </section>
  );
}

function HeroTopSection() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-6 inline-flex items-center gap-2 rounded-lg border bg-background/85 px-3 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur">
        <Sparkles className="size-4 text-primary" />
        AI job matching for global tech careers
      </div>

      <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
        Your resume becomes a live job matching engine.
      </h1>

      <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
        Add your career details once. SwiftCV runs your profile through AI, ML
        signals, and JobLake matching, then alerts you when strong-fit jobs,
        tailored resumes, and interview prep are ready.
      </p>

      <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
        <Link to="/login" className="w-full sm:w-auto">
          <Button size="lg" className="h-12 w-full px-6 text-base sm:w-auto">
            Create your profile <ArrowRight className="size-4" />
          </Button>
        </Link>
        <a href="#workflow" className="w-full sm:w-auto">
          <Button
            size="lg"
            variant="outline"
            className="h-12 w-full px-6 text-base sm:w-auto"
          >
            See the flow
          </Button>
        </a>
      </div>

      <div className="mt-8 grid w-full max-w-3xl gap-3 text-left text-sm text-muted-foreground sm:grid-cols-3 sm:text-center">
        {["Profile signals in", "AI matching in between", "Job alerts out"].map(
          (item) => (
            <div
              key={item}
              className="flex items-center gap-2 sm:justify-center"
            >
              <BadgeCheck className="size-4 text-primary" />
              <span>{item}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function HeroAnimatedFlow() {
  return (
    <div className="relative mx-auto w-full max-w-6xl animate-in fade-in zoom-in-95 duration-700">
      <div className="hero-flow relative min-h-[620px] overflow-hidden rounded-lg border bg-card/86 p-4 shadow-2xl shadow-emerald-950/10 backdrop-blur dark:shadow-black/30 sm:p-6 lg:min-h-[500px]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.08)_1px,transparent_1px)] bg-[size:36px_36px] opacity-70" />

            <svg
              className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
              viewBox="0 0 920 500"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                className="flow-line flow-line-one"
                d="M 190 142 C 312 142 332 250 440 250"
              />
              <path
                className="flow-line flow-line-two"
                d="M 190 250 C 306 250 330 250 440 250"
              />
              <path
                className="flow-line flow-line-three"
                d="M 190 358 C 312 358 332 250 440 250"
              />
              <path
                className="flow-line flow-line-four"
                d="M 520 250 C 632 250 650 132 742 132"
              />
              <path
                className="flow-line flow-line-five"
                d="M 520 250 C 636 250 654 250 742 250"
              />
              <path
                className="flow-line flow-line-six"
                d="M 520 250 C 632 250 650 370 742 370"
              />
              <circle className="flow-particle flow-particle-one" r="5">
                <animateMotion
                  dur="5.6s"
                  repeatCount="indefinite"
                  path="M 190 142 C 312 142 332 250 440 250"
                />
              </circle>
              <circle className="flow-particle flow-particle-two" r="5">
                <animateMotion
                  dur="5.6s"
                  begin="1.2s"
                  repeatCount="indefinite"
                  path="M 190 358 C 312 358 332 250 440 250"
                />
              </circle>
              <circle className="flow-particle flow-particle-three" r="5">
                <animateMotion
                  dur="5.6s"
                  begin="2.1s"
                  repeatCount="indefinite"
                  path="M 520 250 C 632 250 650 132 742 132"
                />
              </circle>
              <circle className="flow-particle flow-particle-four" r="5">
                <animateMotion
                  dur="5.6s"
                  begin="3s"
                  repeatCount="indefinite"
                  path="M 520 250 C 632 250 650 370 742 370"
                />
              </circle>
            </svg>

            <div className="relative z-10 grid h-full gap-5 lg:grid-cols-[1fr_0.9fr_1.12fr] lg:items-center">
              <div className="space-y-4">
                <div className="rounded-lg border bg-background/80 p-4 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <p className="font-bold">Candidate profile</p>
                      <p className="text-xs text-muted-foreground">
                        User enters resume info
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {profileSignals.map((signal, index) => (
                      <div
                        key={signal}
                        className="profile-signal flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm"
                        style={{ animationDelay: `${index * 0.22}s` }}
                      >
                        <span>{signal}</span>
                        <span className="h-2 w-14 rounded-full bg-primary/60" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border bg-background/80 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <DatabaseZap className="size-4 text-primary" />
                    Structured career signals
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span className="rounded-md bg-muted px-2 py-1">skills</span>
                    <span className="rounded-md bg-muted px-2 py-1">seniority</span>
                    <span className="rounded-md bg-muted px-2 py-1">timezone</span>
                    <span className="rounded-md bg-muted px-2 py-1">goals</span>
                  </div>
                </div>
              </div>

              <div className="mobile-flow-connector lg:hidden" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              <div className="relative flex min-h-56 items-center justify-center">
                <div className="engine-ring engine-ring-outer" />
                <div className="engine-ring engine-ring-inner" />
                <div className="engine-core relative flex size-40 flex-col items-center justify-center rounded-full border bg-background/90 text-center shadow-2xl shadow-primary/20">
                  <Cpu className="mb-2 size-8 text-primary" />
                  <p className="text-sm font-bold">SwiftCV Engine</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    match, rank, prepare
                  </p>
                </div>

                {engineSignals.map((signal, index) => (
                  <span
                    key={signal}
                    className="engine-chip absolute rounded-md border bg-card px-2.5 py-1 text-xs font-bold text-primary shadow-sm"
                    style={{ "--chip-index": index } as CSSProperties}
                  >
                    {signal}
                  </span>
                ))}
              </div>

              <div className="mobile-flow-connector lg:hidden" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border bg-primary/10 p-4 text-primary">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <BellRing className="notification-bell size-4" />
                    New strong-fit job found
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Alert sent when matching score crosses your threshold.
                  </p>
                </div>

                {outputCards.map((card, index) => {
                  const Icon = card.icon;

                  return (
                    <div
                      key={card.title}
                      className="output-card rounded-lg border bg-background/80 p-4 shadow-sm"
                      style={{ animationDelay: `${0.4 + index * 0.22}s` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="size-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold">{card.title}</p>
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                              <MapPin className="size-3.5" />
                              {card.meta}
                            </div>
                          </div>
                        </div>
                        <span className="shrink-0 rounded-md bg-primary px-2.5 py-1 text-sm font-bold text-primary-foreground">
                          {card.value}
                        </span>
                      </div>
                    </div>
                  );
                })}

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-background/80 p-3">
                    <SearchCheck className="mb-2 size-5 text-primary" />
                    <p className="text-xl font-bold">23</p>
                    <p className="text-xs text-muted-foreground">jobs scanned</p>
                  </div>
                  <div className="rounded-lg border bg-background/80 p-3">
                    <WandSparkles className="mb-2 size-5 text-primary" />
                    <p className="text-xl font-bold">3</p>
                    <p className="text-xs text-muted-foreground">actions ready</p>
                  </div>
                </div>
              </div>
            </div>
      </div>
    </div>
  );
}
