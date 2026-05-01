import { useEffect, useState } from "react";
import type { Recommendation } from "../lib/types";
import { EditSheet } from "./edit-sheet";
import { TextAreaField, TextField } from "./form-fields";

const emptyRecommendation: Recommendation = {
  id: "",
  name: "",
  role: "",
  email: "",
  note: "",
};

export function RecommendationForm(props: {
  open: boolean;
  value?: Recommendation;
  saving?: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (value: Recommendation) => void;
}) {
  const [draft, setDraft] = useState(props.value ?? emptyRecommendation);

  useEffect(() => setDraft(props.value ?? emptyRecommendation), [props.value, props.open]);

  return (
    <EditSheet open={props.open} title="Recommendation" description="Store references and recommendation notes." saving={props.saving} onOpenChange={props.onOpenChange} onSave={() => props.onSave(draft)}>
      <TextField label="Name" value={draft.name} onChange={(name) => setDraft({ ...draft, name })} />
      <TextField label="Role" value={draft.role} onChange={(role) => setDraft({ ...draft, role })} />
      <TextField label="Email" value={draft.email} onChange={(email) => setDraft({ ...draft, email })} />
      <TextAreaField label="Note" value={draft.note} onChange={(note) => setDraft({ ...draft, note })} />
    </EditSheet>
  );
}

export { emptyRecommendation };
