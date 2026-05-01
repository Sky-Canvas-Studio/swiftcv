import { useEffect, useState } from "react";
import type { DatedEntry } from "../lib/types";
import { CheckField, TextAreaField, TextField } from "./form-fields";
import { EditSheet } from "./edit-sheet";

const emptyEntry: DatedEntry = {
  id: "",
  title: "",
  organization: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
};

export function EntryForm(props: {
  open: boolean;
  title: string;
  description: string;
  value?: DatedEntry;
  saving?: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (value: DatedEntry) => void;
}) {
  const [draft, setDraft] = useState(props.value ?? emptyEntry);

  useEffect(() => {
    setDraft(props.value ?? emptyEntry);
  }, [props.value, props.open]);

  return (
    <EditSheet
      open={props.open}
      title={props.title}
      description={props.description}
      saving={props.saving}
      onOpenChange={props.onOpenChange}
      onSave={() => props.onSave(draft)}
    >
      <TextField label="Title" value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
      <TextField label="Organization" value={draft.organization} onChange={(organization) => setDraft({ ...draft, organization })} />
      <TextField label="Location" value={draft.location} onChange={(location) => setDraft({ ...draft, location })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Start date" type="month" value={draft.startDate} onChange={(startDate) => setDraft({ ...draft, startDate })} />
        <TextField label="End date" type="month" value={draft.endDate} onChange={(endDate) => setDraft({ ...draft, endDate })} />
      </div>
      <CheckField label="This is ongoing" checked={draft.current} onChange={(current) => setDraft({ ...draft, current })} />
      <TextAreaField label="Description" value={draft.description} onChange={(description) => setDraft({ ...draft, description })} />
    </EditSheet>
  );
}

export { emptyEntry };
