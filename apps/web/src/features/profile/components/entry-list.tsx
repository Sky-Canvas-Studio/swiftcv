import type { DatedEntry } from "../lib/types";
import { EntryMenu } from "./small-actions";

export function EntryList(props: {
  entries: DatedEntry[];
  emptyText: string;
  onEdit: (entry: DatedEntry) => void;
  onDelete: (id: string) => void;
  onMove: (from: number, to: number) => void;
}) {
  if (props.entries.length === 0) {
    return <div className="p-5 text-sm text-muted-foreground">{props.emptyText}</div>;
  }

  return (
    <div className="divide-y">
      {props.entries.map((entry, index) => (
        <article key={entry.id} className="grid gap-3 p-5 sm:grid-cols-[1fr_auto]">
          <div className="min-w-0 space-y-1">
            <h3 className="truncate text-sm font-semibold text-primary">{entry.title || "Untitled entry"}</h3>
            <p className="text-sm text-muted-foreground">{entry.organization || "No organization"}</p>
            <p className="text-xs text-muted-foreground">
              {[entry.startDate, entry.current ? "Ongoing" : entry.endDate, entry.location].filter(Boolean).join(" - ")}
            </p>
            {entry.description && <p className="line-clamp-3 text-sm">{entry.description}</p>}
          </div>
          <EntryMenu
            canMoveUp={index > 0}
            canMoveDown={index < props.entries.length - 1}
            onEdit={() => props.onEdit(entry)}
            onDelete={() => props.onDelete(entry.id)}
            onMoveUp={() => props.onMove(index, index - 1)}
            onMoveDown={() => props.onMove(index, index + 1)}
          />
        </article>
      ))}
    </div>
  );
}
