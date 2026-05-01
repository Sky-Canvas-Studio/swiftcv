import {
  BadgeCheck,
  BrainCircuit,
  FileSearch,
  FileText,
  Globe2,
  ListChecks,
  Sparkles,
} from "lucide-react";

const benefits = [
  {
    title: "Profile-first matching",
    description:
      "Skills, experience, seniority, location, and career goals become structured signals for better recommendations.",
    icon: FileSearch,
  },
  {
    title: "Ranked jobs with scores",
    description:
      "Every recommendation shows why it fits, so candidates can spend time on the highest-quality applications.",
    icon: BadgeCheck,
  },
  {
    title: "Custom resume versions",
    description:
      "Generate targeted resumes that emphasize the projects, skills, and keywords each job description needs.",
    icon: FileText,
  },
  {
    title: "AI interview prep",
    description:
      "Create role-specific technical, behavioral, and project questions from the candidate profile and job post.",
    icon: BrainCircuit,
  },
  {
    title: "Built for global search",
    description:
      "Support worldwide, remote, hybrid, and relocation-friendly job discovery for modern tech careers.",
    icon: Globe2,
  },
  {
    title: "Application focus",
    description:
      "Keep profile, matches, resume variants, and prep material organized around each opportunity.",
    icon: ListChecks,
  },
];

export const Features = () => {
  return (
    <section id="features" className="border-b py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-medium text-muted-foreground">
              <Sparkles className="size-4 text-primary" />
              Career search operating system
            </div>
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Benefits built around how tech candidates actually apply.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            SwiftCV connects resume data, job search, matching scores, resume
            tailoring, and interview prep into one focused workflow instead of
            making candidates jump across disconnected tools.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {benefits.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-lg border bg-card p-6 shadow-sm transition-colors hover:border-primary/50"
              >
                <div className="mb-5 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
