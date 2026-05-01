import { ArrowRight, FileUp, Search, SlidersHorizontal, WandSparkles } from "lucide-react";

const steps = [
  {
    title: "Build your career profile",
    description:
      "Add resume info, skills, projects, target roles, preferred locations, and work preferences.",
    icon: FileUp,
  },
  {
    title: "Search through JobLake",
    description:
      "SwiftCV sends your profile to the job matching service to discover relevant opportunities.",
    icon: Search,
  },
  {
    title: "Compare ranked matches",
    description:
      "Review scores, strengths, gaps, and reasons before choosing where to spend application energy.",
    icon: SlidersHorizontal,
  },
  {
    title: "Prepare and apply",
    description:
      "Generate a tailored resume and interview questions for the jobs that are worth pursuing.",
    icon: WandSparkles,
  },
];

export const Workflow = () => {
  return (
    <section id="workflow" className="border-b bg-muted/35 py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            From resume data to application-ready in one flow.
          </h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">
            The product is designed around a practical job search loop:
            understand the candidate, find the right jobs, explain the match,
            then prepare the application.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.title} className="relative rounded-lg border bg-card p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-10 hidden size-6 text-primary xl:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
