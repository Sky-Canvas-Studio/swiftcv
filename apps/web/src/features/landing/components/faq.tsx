import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Who is SwiftCV for?",
    answer:
      "SwiftCV is built for job seekers in tech, especially software developers, engineers, product-minded builders, and candidates applying across remote or global markets.",
  },
  {
    question: "How does the match score help me?",
    answer:
      "The score gives you a quick way to compare roles by profile fit. It should help you focus on jobs where your skills, experience, seniority, and preferences line up better.",
  },
  {
    question: "Can SwiftCV create a different resume for every job?",
    answer:
      "Yes. The goal is to use your base profile and the selected job description to generate a resume version that highlights the most relevant skills, projects, and keywords.",
  },
  {
    question: "Does it help with interviews?",
    answer:
      "Yes. SwiftCV can prepare interview questions from the job description and your resume profile, including technical, project, and behavioral prompts.",
  },
  {
    question: "Where does job matching happen?",
    answer:
      "The web app and server handle the user product flow, while JobLake is the separate microservice responsible for job discovery and advanced matching.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="border-b bg-muted/35 py-20 md:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Questions candidates usually ask.
          </h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">
            SwiftCV is focused on making the job search more targeted, not more
            noisy.
          </p>
        </div>

        <Accordion className="w-full space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`item-${index}`}
              className="rounded-lg border bg-card px-5"
            >
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="leading-7 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
