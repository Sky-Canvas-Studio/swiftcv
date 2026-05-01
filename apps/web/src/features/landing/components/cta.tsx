import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, FileText, SearchCheck } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 rounded-lg border bg-[linear-gradient(135deg,hsl(166_58%_34%),hsl(184_70%_28%))] p-6 text-primary-foreground shadow-2xl shadow-emerald-950/20 md:grid-cols-[1fr_auto] md:items-center md:p-10 dark:shadow-black/30">
          <div>
            <div className="mb-5 flex gap-3">
              <span className="flex size-11 items-center justify-center rounded-lg bg-white/15">
                <SearchCheck className="size-5" />
              </span>
              <span className="flex size-11 items-center justify-center rounded-lg bg-white/15">
                <FileText className="size-5" />
              </span>
            </div>
            <h2 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Build your profile once. Apply smarter to every serious match.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-primary-foreground/80 md:text-lg">
              Start with your resume data, then let SwiftCV help find relevant
              jobs, explain fit, generate prep questions, and create custom
              resumes.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Link to="/login">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 w-full px-6 text-base font-bold md:w-56"
              >
                Create your profile
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full border-white/30 bg-white/10 px-6 text-base font-bold text-primary-foreground hover:bg-white/20 md:w-56"
              >
                Start matching <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
