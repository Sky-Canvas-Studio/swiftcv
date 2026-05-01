import { Button } from "@/components/ui/button";
import type { CustomSection, DatedEntry } from "../lib/types";
import { EntryList } from "./entry-list";
import { EntryMenu } from "./small-actions";

export function CustomSectionsView(props: {
  sections: CustomSection[];
  onAddEntry: (section: CustomSection) => void;
  onEditSection: (section: CustomSection) => void;
  onDeleteSection: (id: string) => void;
  onMoveSection: (from: number, to: number) => void;
  onEditEntry: (section: CustomSection, entry: DatedEntry) => void;
  onDeleteEntry: (section: CustomSection, id: string) => void;
  onMoveEntry: (section: CustomSection, from: number, to: number) => void;
}) {
  if (props.sections.length === 0) {
    return <p className="p-5 text-sm text-muted-foreground">Create custom sections for awards, publications, certificates, or anything else.</p>;
  }

  return (
    <div className="divide-y">
      {props.sections.map((section, index) => (
        <section key={section.id} className="p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="min-w-0 truncate text-sm font-semibold">{section.title || "Untitled section"}</h3>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => props.onAddEntry(section)}>Add entry</Button>
              <EntryMenu
                canMoveUp={index > 0}
                canMoveDown={index < props.sections.length - 1}
                onEdit={() => props.onEditSection(section)}
                onDelete={() => props.onDeleteSection(section.id)}
                onMoveUp={() => props.onMoveSection(index, index - 1)}
                onMoveDown={() => props.onMoveSection(index, index + 1)}
              />
            </div>
          </div>
          <div className="overflow-hidden rounded-md border">
            <EntryList
              entries={section.entries}
              emptyText="No entries in this custom section."
              onEdit={(entry) => props.onEditEntry(section, entry)}
              onDelete={(id) => props.onDeleteEntry(section, id)}
              onMove={(from, to) => props.onMoveEntry(section, from, to)}
            />
          </div>
        </section>
      ))}
    </div>
  );
}
