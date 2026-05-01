import { useEffect, useState } from "react";
import type { CustomSection } from "../lib/types";
import { EditSheet } from "./edit-sheet";
import { TextField } from "./form-fields";

const emptyCustomSection: CustomSection = {
  id: "",
  title: "",
  entries: [],
};

export function CustomSectionForm(props: {
  open: boolean;
  value?: CustomSection;
  saving?: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (value: CustomSection) => void;
}) {
  const [draft, setDraft] = useState(props.value ?? emptyCustomSection);

  useEffect(() => {
    setDraft(props.value ?? emptyCustomSection);
  }, [props.value, props.open]);

  return (
    <EditSheet
      open={props.open}
      title="Custom section"
      description="Create a reusable profile section for anything your CV needs."
      saving={props.saving}
      onOpenChange={props.onOpenChange}
      onSave={() => props.onSave(draft)}
    >
      <TextField
        label="Section title"
        value={draft.title}
        onChange={(title) => setDraft({ ...draft, title })}
        placeholder="Awards, publications, conferences"
      />
    </EditSheet>
  );
}

export { emptyCustomSection };
