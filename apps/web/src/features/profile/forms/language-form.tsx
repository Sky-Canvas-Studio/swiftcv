import { useEffect, useState } from "react";
import type { LanguageSkill } from "../lib/types";
import { EditSheet } from "./edit-sheet";
import { TextField } from "./form-fields";

const emptyLanguage: LanguageSkill = {
  id: "",
  language: "",
  level: "",
  listening: "",
  reading: "",
  spokenInteraction: "",
  spokenProduction: "",
  writing: "",
};

export function LanguageForm(props: {
  open: boolean;
  value?: LanguageSkill;
  saving?: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (value: LanguageSkill) => void;
}) {
  const [draft, setDraft] = useState(props.value ?? emptyLanguage);

  useEffect(() => setDraft(props.value ?? emptyLanguage), [props.value, props.open]);

  return (
    <EditSheet open={props.open} title="Language skill" description="Use CEFR levels when you know them, for example B2 or C1." saving={props.saving} onOpenChange={props.onOpenChange} onSave={() => props.onSave(draft)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Language" value={draft.language} onChange={(language) => setDraft({ ...draft, language })} />
        <TextField label="Overall level" value={draft.level} onChange={(level) => setDraft({ ...draft, level })} />
        <TextField label="Listening" value={draft.listening} onChange={(listening) => setDraft({ ...draft, listening })} />
        <TextField label="Reading" value={draft.reading} onChange={(reading) => setDraft({ ...draft, reading })} />
        <TextField label="Spoken interaction" value={draft.spokenInteraction} onChange={(spokenInteraction) => setDraft({ ...draft, spokenInteraction })} />
        <TextField label="Spoken production" value={draft.spokenProduction} onChange={(spokenProduction) => setDraft({ ...draft, spokenProduction })} />
        <TextField label="Writing" value={draft.writing} onChange={(writing) => setDraft({ ...draft, writing })} />
      </div>
    </EditSheet>
  );
}

export { emptyLanguage };
