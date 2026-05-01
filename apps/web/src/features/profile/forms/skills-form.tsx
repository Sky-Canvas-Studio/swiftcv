import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createId } from "../lib/profile-utils";
import type { SkillCategory } from "../lib/types";
import { EditSheet } from "./edit-sheet";
import { TextField } from "./form-fields";

export function SkillsForm(props: {
  open: boolean;
  value: SkillCategory[];
  saving?: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (value: SkillCategory[]) => void;
}) {
  const [draft, setDraft] = useState(props.value);

  useEffect(() => setDraft(props.value), [props.value, props.open]);

  return (
    <EditSheet open={props.open} title="Personal skills" description="Group skills into categories for reuse across CVs." saving={props.saving} onOpenChange={props.onOpenChange} onSave={() => props.onSave(draft)}>
      <Button variant="outline" onClick={() => setDraft([...draft, { id: createId("skill"), name: "", skills: [] }])}>Add category</Button>
      {draft.map((category) => (
        <div key={category.id} className="grid gap-3 rounded-md border p-3">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <TextField label="Category" value={category.name} onChange={(name) => setDraft(draft.map((item) => item.id === category.id ? { ...item, name } : item))} />
            <Button variant="ghost" className="self-end" onClick={() => setDraft(draft.filter((item) => item.id !== category.id))}>Remove</Button>
          </div>
          <TextField label="Skills, separated by comma" value={category.skills.join(", ")} onChange={(value) => setDraft(draft.map((item) => item.id === category.id ? { ...item, skills: value.split(",").map((skill) => skill.trim()).filter(Boolean) } : item))} />
        </div>
      ))}
    </EditSheet>
  );
}
