import { Clock3, FileCheck2, LineChart, MessagesSquare } from "lucide-react";

const proofPoints = [
  {
    value: "3x",
    label: "faster shortlisting",
    description:
      "Compare scored opportunities instead of manually scanning every posting from scratch.",
    icon: Clock3,
  },
  {
    value: "94%",
    label: "example top match",
    description:
      "See how strongly a role aligns with skills, stack, seniority, and work preferences.",
    icon: LineChart,
  },
  {
    value: "1:1",
    label: "resume-to-job tailoring",
    description:
      "Turn one profile into role-specific resumes that speak directly to each job description.",
    icon: FileCheck2,
  },
  {
    value: "AI",
    label: "interview prep",
    description:
      "Practice technical and behavioral questions generated from the job and candidate profile.",
    icon: MessagesSquare,
  },
];

export const Testimonials = () => {
  return (
    <section id="proof" className="border-b py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Designed to improve the quality of every application.
          </h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">
            Instead of invented testimonials, SwiftCV shows its value through a
            tighter workflow: better matches, clearer tradeoffs, stronger
            resumes, and sharper preparation.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {proofPoints.map((point) => {
            const Icon = point.icon;

            return (
              <div key={point.label} className="rounded-lg border bg-card p-6">
                <Icon className="mb-6 size-6 text-primary" />
                <p className="text-4xl font-bold">{point.value}</p>
                <p className="mt-2 font-semibold">{point.label}</p>
                <p className="mt-4 leading-7 text-muted-foreground">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
