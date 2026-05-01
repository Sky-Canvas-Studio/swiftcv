import { Badge } from "@/components/ui/badge";
import type { SkillCategory } from "../lib/types";

export function SkillsView(props: { categories: SkillCategory[] }) {
  if (props.categories.length === 0) {
    return <p className="p-5 text-sm text-muted-foreground">Add skill categories like Frontend, Backend, Databases, or DevOps.</p>;
  }

  return (
    <div className="grid gap-5 p-5">
      {props.categories.map((category) => (
        <section key={category.id} className="grid gap-2">
          <h3 className="text-sm font-semibold">{category.name || "Untitled category"}</h3>
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <Badge key={skill} variant="outline" className="rounded-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
