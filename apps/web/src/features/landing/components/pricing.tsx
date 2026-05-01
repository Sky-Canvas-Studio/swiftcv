import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const plan = {
  name: "SwiftCV Pro",
  slug: "pro_monthly",
  price: "$4.99",
  description:
    "For active job seekers who want focused recommendations, tailored applications, and AI prep.",
  features: [
    "Resume profile and skill signal matching",
    "Ranked job recommendations with match scores",
    "AI-generated interview questions",
    "Custom resume versions for selected jobs",
    "1-month free trial included",
  ],
  cta: "Start 1-month free trial",
};

export const Pricing = () => {
  const handleCheckout = async (slug: string) => {
    try {
      const result = await authClient.checkout({
        slug,
      });

      if (result.error) {
        toast.error(result.error.message || "Something went wrong");
        return;
      }

      if (result.data?.url) {
        window.location.href = result.data.url;
      }
    } catch {
      toast.error("Failed to initiate checkout");
    }
  };

  return (
    <section id="pricing" className="border-b bg-muted/35 py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-medium text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            Simple pricing
          </div>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            One plan for a sharper job search.
          </h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">
            Start with the full SwiftCV workflow: profile matching, smart job
            recommendations, AI prep, and tailored resumes.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-lg rounded-lg border bg-card p-6 shadow-xl shadow-emerald-950/10 dark:shadow-black/30 md:p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-2xl font-bold">{plan.name}</p>
              <p className="mt-2 leading-7 text-muted-foreground">
                {plan.description}
              </p>
            </div>
            <span className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-bold text-primary">
              Free trial
            </span>
          </div>

          <div className="mb-8 flex items-end gap-2">
            <span className="text-5xl font-bold">{plan.price}</span>
            <span className="pb-2 text-muted-foreground">/month</span>
          </div>

          <div className="mb-8 space-y-3">
            {plan.features.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Check className="size-3.5" />
                </div>
                <span className="text-sm font-medium leading-6">{feature}</span>
              </div>
            ))}
          </div>

          <Button
            variant="default"
            size="lg"
            className="h-12 w-full text-base font-bold"
            onClick={() => handleCheckout(plan.slug)}
          >
            {plan.cta}
          </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            No long-term commitment. Upgrade when you are ready to apply with focus.
          </p>
        </div>
      </div>
    </section>
  );
};
