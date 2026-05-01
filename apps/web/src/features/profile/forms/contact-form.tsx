import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createId } from "../lib/profile-utils";
import type { ContactInfo } from "../lib/types";
import { EditSheet } from "./edit-sheet";
import { TextField } from "./form-fields";

export function ContactForm(props: {
  open: boolean;
  value: ContactInfo;
  saving?: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (value: ContactInfo) => void;
}) {
  const [draft, setDraft] = useState(props.value);

  useEffect(() => setDraft(props.value), [props.value, props.open]);

  return (
    <EditSheet open={props.open} title="Contact" description="Add the contact details you want available for CVs." saving={props.saving} onOpenChange={props.onOpenChange} onSave={() => props.onSave(draft)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Email" value={draft.email} onChange={(email) => setDraft({ ...draft, email })} />
        <TextField label="Phone" value={draft.phone} onChange={(phone) => setDraft({ ...draft, phone })} />
        <TextField label="Website" value={draft.website} onChange={(website) => setDraft({ ...draft, website })} />
        <TextField label="City" value={draft.city} onChange={(city) => setDraft({ ...draft, city })} />
        <TextField label="Country" value={draft.country} onChange={(country) => setDraft({ ...draft, country })} />
        <TextField label="Address" value={draft.address} onChange={(address) => setDraft({ ...draft, address })} />
      </div>
      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Links</h3>
          <Button variant="outline" size="sm" onClick={() => setDraft({ ...draft, links: [...draft.links, { id: createId("link"), label: "", url: "" }] })}>Add link</Button>
        </div>
        {draft.links.map((link) => (
          <div key={link.id} className="grid gap-3 rounded-md border p-3 sm:grid-cols-[1fr_1fr_auto]">
            <TextField label="Label" value={link.label} onChange={(label) => setDraft({ ...draft, links: draft.links.map((item) => item.id === link.id ? { ...item, label } : item) })} />
            <TextField label="URL" value={link.url} onChange={(url) => setDraft({ ...draft, links: draft.links.map((item) => item.id === link.id ? { ...item, url } : item) })} />
            <Button variant="ghost" className="self-end" onClick={() => setDraft({ ...draft, links: draft.links.filter((item) => item.id !== link.id) })}>Remove</Button>
          </div>
        ))}
      </div>
    </EditSheet>
  );
}
