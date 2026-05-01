import type { Recommendation } from "../lib/types";
import { EntryMenu } from "./small-actions";

export function RecommendationList(props: {
  recommendations: Recommendation[];
  onEdit: (item: Recommendation) => void;
  onDelete: (id: string) => void;
  onMove: (from: number, to: number) => void;
}) {
  if (props.recommendations.length === 0) {
    return <p className="p-5 text-sm text-muted-foreground">Add references or recommendation notes.</p>;
  }

  return (
    <div className="divide-y">
      {props.recommendations.map((item, index) => (
        <article key={item.id} className="grid gap-3 p-5 sm:grid-cols-[1fr_auto]">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-primary">
              {[item.name, item.role].filter(Boolean).join(", ") || "Untitled recommendation"}
            </h3>
            {item.email && <p className="text-sm text-muted-foreground">{item.email}</p>}
            {item.note && <p className="mt-1 line-clamp-2 text-sm">{item.note}</p>}
          </div>
          <EntryMenu
            canMoveUp={index > 0}
            canMoveDown={index < props.recommendations.length - 1}
            onEdit={() => props.onEdit(item)}
            onDelete={() => props.onDelete(item.id)}
            onMoveUp={() => props.onMove(index, index - 1)}
            onMoveDown={() => props.onMove(index, index + 1)}
          />
        </article>
      ))}
    </div>
  );
}
