import { useEffect, useState } from "react";
import { EditSheet } from "./edit-sheet";
import { TextAreaField, TextField } from "./form-fields";
import type { PersonalInfo } from "../lib/types";

export function PersonalForm(props: {
  open: boolean;
  value: PersonalInfo;
  saving?: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (value: PersonalInfo) => void;
}) {
  const [draft, setDraft] = useState(props.value);

  useEffect(() => setDraft(props.value), [props.value, props.open]);

  return (
    <EditSheet
      open={props.open}
      title="Personal information"
      description="This becomes the source profile used for future CV versions."
      saving={props.saving}
      onOpenChange={props.onOpenChange}
      onSave={() => props.onSave(draft)}
    >
      <TextField label="Full name" value={draft.fullName} onChange={(fullName) => setDraft({ ...draft, fullName })} />
      <TextField label="Professional headline" value={draft.headline} onChange={(headline) => setDraft({ ...draft, headline })} />
      <TextAreaField label="Profile summary" value={draft.summary} onChange={(summary) => setDraft({ ...draft, summary })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Date of birth" type="date" value={draft.dateOfBirth} onChange={(dateOfBirth) => setDraft({ ...draft, dateOfBirth })} />
        <TextField label="Nationality" value={draft.nationality} onChange={(nationality) => setDraft({ ...draft, nationality })} />
        <TextField label="City of birth" value={draft.cityOfBirth} onChange={(cityOfBirth) => setDraft({ ...draft, cityOfBirth })} />
        <TextField label="Country of birth" value={draft.countryOfBirth} onChange={(countryOfBirth) => setDraft({ ...draft, countryOfBirth })} />
      </div>
    </EditSheet>
  );
}
