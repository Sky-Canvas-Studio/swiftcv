import { useEffect, useState } from "react";
import { EditSheet } from "./edit-sheet";
import { TextAreaField, TextField } from "./form-fields";

export function ProfileMetaForm(props: {
  open: boolean;
  photoUrl: string | null;
  headline: string | null;
  summary: string | null;
  saving?: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (value: { photoUrl: string | null; headline: string | null; summary: string | null }) => void;
}) {
  const [draft, setDraft] = useState({
    photoUrl: props.photoUrl ?? "",
    headline: props.headline ?? "",
    summary: props.summary ?? "",
  });

  useEffect(() => {
    setDraft({
      photoUrl: props.photoUrl ?? "",
      headline: props.headline ?? "",
      summary: props.summary ?? "",
    });
  }, [props.photoUrl, props.headline, props.summary, props.open]);

  return (
    <EditSheet
      open={props.open}
      title="Profile header"
      description="Set the image URL and default headline used by your profile."
      saving={props.saving}
      onOpenChange={props.onOpenChange}
      onSave={() => props.onSave({
        photoUrl: draft.photoUrl || null,
        headline: draft.headline || null,
        summary: draft.summary || null,
      })}
    >
      <TextField label="Photo URL" value={draft.photoUrl} onChange={(photoUrl) => setDraft({ ...draft, photoUrl })} />
      <TextField label="Default headline" value={draft.headline} onChange={(headline) => setDraft({ ...draft, headline })} />
      <TextAreaField label="Default summary" value={draft.summary} onChange={(summary) => setDraft({ ...draft, summary })} />
    </EditSheet>
  );
}
