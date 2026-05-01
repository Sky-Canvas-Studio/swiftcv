import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { createId, moveItem } from "./lib/profile-utils";
import { reorderSection, saveCustomSection, saveEntry, saveLanguage, saveRecommendation } from "./lib/profile-editor";
import { useProfileQuery, useUpdateProfileMutation } from "./lib/profile-api";
import type { CustomSection, DatedEntry, LanguageSkill, Recommendation, ResumeProfile } from "./lib/types";
import { ContactForm } from "./forms/contact-form";
import { CustomSectionForm } from "./forms/custom-section-form";
import { EntryForm } from "./forms/entry-form";
import { LanguageForm } from "./forms/language-form";
import { PersonalForm } from "./forms/personal-form";
import { ProfileMetaForm } from "./forms/profile-meta-form";
import { RecommendationForm } from "./forms/recommendation-form";
import { SkillsForm } from "./forms/skills-form";
import { ProfileHeader } from "./components/profile-header";
import { ProfileSections } from "./components/profile-sections";
import { SectionNavigator } from "./components/section-navigator";

type EntrySection = "education" | "experience" | "work" | "projects";
type EntryEdit = { section: EntrySection; item?: DatedEntry; customSectionId?: string };

export function ProfilePage() {
  const query = useProfileQuery();
  const updateProfile = useUpdateProfileMutation();
  const profile = query.data;
  const [metaOpen, setMetaOpen] = useState(false);
  const [personalOpen, setPersonalOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [entryEdit, setEntryEdit] = useState<EntryEdit | null>(null);
  const [languageEdit, setLanguageEdit] = useState<LanguageSkill | null>();
  const [recommendationEdit, setRecommendationEdit] = useState<Recommendation | null>();
  const [customEdit, setCustomEdit] = useState<CustomSection | null>();

  if (query.isLoading || !profile) {
    return <LoadingProfile />;
  }

  const save = (next: ResumeProfile) => updateProfile.mutate(next);
  const content = profile.content;

  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <div className="grid gap-1">
        <h1 className="text-2xl font-semibold tracking-normal">My Profile</h1>
        <p className="text-sm text-muted-foreground">Create structured profile data first, then reuse it for tailored CVs later.</p>
      </div>
      <ProfileHeader
        personal={{
          ...content.personal,
          headline: profile.headline ?? content.personal.headline,
          summary: profile.summary ?? content.personal.summary,
        }}
        photoUrl={profile.photoUrl}
        onEdit={() => setMetaOpen(true)}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <main className="grid min-w-0 gap-6">
          <ProfileSections
            profile={profile}
            onMoveSection={(from, to) => save(reorderSection(profile, from, to))}
            onEditPersonal={() => setPersonalOpen(true)}
            onEditContact={() => setContactOpen(true)}
            onEditSkills={() => setSkillsOpen(true)}
            onAddEntry={(section) => setEntryEdit({ section })}
            onEditEntry={(section, item) => setEntryEdit({ section, item })}
            onDeleteEntry={(section, id) => save({ ...profile, content: { ...content, [section]: content[section].filter((item) => item.id !== id) } })}
            onMoveEntry={(section, from, to) => save({ ...profile, content: { ...content, [section]: moveItem(content[section], from, to) } })}
            onAddLanguage={() => setLanguageEdit(null)}
            onEditLanguage={setLanguageEdit}
            onDeleteLanguage={(id) => save({ ...profile, content: { ...content, languages: content.languages.filter((item) => item.id !== id) } })}
            onMoveLanguage={(from, to) => save({ ...profile, content: { ...content, languages: moveItem(content.languages, from, to) } })}
            onAddRecommendation={() => setRecommendationEdit(null)}
            onEditRecommendation={setRecommendationEdit}
            onDeleteRecommendation={(id) => save({ ...profile, content: { ...content, recommendations: content.recommendations.filter((item) => item.id !== id) } })}
            onMoveRecommendation={(from, to) => save({ ...profile, content: { ...content, recommendations: moveItem(content.recommendations, from, to) } })}
            onAddCustomSection={() => setCustomEdit(null)}
            onEditCustomSection={setCustomEdit}
            onDeleteCustomSection={(id) => save({ ...profile, content: { ...content, customSections: content.customSections.filter((item) => item.id !== id) } })}
            onMoveCustomSection={(from, to) => save({ ...profile, content: { ...content, customSections: moveItem(content.customSections, from, to) } })}
            onAddCustomEntry={(section) => setEntryEdit({ section: "experience", customSectionId: section.id })}
            onEditCustomEntry={(section, item) => setEntryEdit({ section: "experience", item, customSectionId: section.id })}
            onDeleteCustomEntry={(section, id) => save(updateCustomEntries(profile, section.id, section.entries.filter((item) => item.id !== id)))}
            onMoveCustomEntry={(section, from, to) => save(updateCustomEntries(profile, section.id, moveItem(section.entries, from, to)))}
          />
        </main>
        <aside className="hidden lg:block">
          <SectionNavigator order={profile.sectionOrder} onMove={(from, to) => save(reorderSection(profile, from, to))} />
        </aside>
      </div>
      <ProfileForms profile={profile} saving={updateProfile.isPending} metaOpen={metaOpen} setMetaOpen={setMetaOpen} personalOpen={personalOpen} setPersonalOpen={setPersonalOpen} contactOpen={contactOpen} setContactOpen={setContactOpen} skillsOpen={skillsOpen} setSkillsOpen={setSkillsOpen} entryEdit={entryEdit} setEntryEdit={setEntryEdit} languageEdit={languageEdit} setLanguageEdit={setLanguageEdit} recommendationEdit={recommendationEdit} setRecommendationEdit={setRecommendationEdit} customEdit={customEdit} setCustomEdit={setCustomEdit} save={save} />
    </div>
  );
}

function LoadingProfile() {
  return (
    <Card className="flex min-h-80 items-center justify-center">
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
    </Card>
  );
}

function updateCustomEntries(profile: ResumeProfile, sectionId: string, entries: DatedEntry[]) {
  return {
    ...profile,
    content: {
      ...profile.content,
      customSections: profile.content.customSections.map((section) => section.id === sectionId ? { ...section, entries } : section),
    },
  };
}

function ProfileForms(props: {
  profile: ResumeProfile;
  saving: boolean;
  metaOpen: boolean;
  setMetaOpen: (open: boolean) => void;
  personalOpen: boolean;
  setPersonalOpen: (open: boolean) => void;
  contactOpen: boolean;
  setContactOpen: (open: boolean) => void;
  skillsOpen: boolean;
  setSkillsOpen: (open: boolean) => void;
  entryEdit: EntryEdit | null;
  setEntryEdit: (value: EntryEdit | null) => void;
  languageEdit?: LanguageSkill | null;
  setLanguageEdit: (value?: LanguageSkill | null) => void;
  recommendationEdit?: Recommendation | null;
  setRecommendationEdit: (value?: Recommendation | null) => void;
  customEdit?: CustomSection | null;
  setCustomEdit: (value?: CustomSection | null) => void;
  save: (profile: ResumeProfile) => void;
}) {
  const profile = props.profile;
  const content = profile.content;
  const close = () => {
    props.setEntryEdit(null);
    props.setLanguageEdit(undefined);
    props.setRecommendationEdit(undefined);
    props.setCustomEdit(undefined);
  };

  return (
    <>
      <ProfileMetaForm open={props.metaOpen} photoUrl={profile.photoUrl} headline={profile.headline} summary={profile.summary} saving={props.saving} onOpenChange={props.setMetaOpen} onSave={(meta) => { props.save({ ...profile, ...meta }); props.setMetaOpen(false); }} />
      <PersonalForm open={props.personalOpen} value={content.personal} saving={props.saving} onOpenChange={props.setPersonalOpen} onSave={(personal) => { props.save({ ...profile, content: { ...content, personal } }); props.setPersonalOpen(false); }} />
      <ContactForm open={props.contactOpen} value={content.contact} saving={props.saving} onOpenChange={props.setContactOpen} onSave={(contact) => { props.save({ ...profile, content: { ...content, contact } }); props.setContactOpen(false); }} />
      <SkillsForm open={props.skillsOpen} value={content.skills} saving={props.saving} onOpenChange={props.setSkillsOpen} onSave={(skills) => { props.save({ ...profile, content: { ...content, skills } }); props.setSkillsOpen(false); }} />
      <EntryForm open={Boolean(props.entryEdit)} title="Profile entry" description="Add structured timeline information." value={props.entryEdit?.item} saving={props.saving} onOpenChange={(open) => !open && close()} onSave={(entry) => saveProfileEntry(props, entry)} />
      <LanguageForm open={props.languageEdit !== undefined} value={props.languageEdit ?? undefined} saving={props.saving} onOpenChange={(open) => !open && close()} onSave={(language) => { props.save({ ...profile, content: { ...content, languages: saveLanguage(content.languages, language) } }); close(); }} />
      <RecommendationForm open={props.recommendationEdit !== undefined} value={props.recommendationEdit ?? undefined} saving={props.saving} onOpenChange={(open) => !open && close()} onSave={(item) => { props.save({ ...profile, content: { ...content, recommendations: saveRecommendation(content.recommendations, item) } }); close(); }} />
      <CustomSectionForm open={props.customEdit !== undefined} value={props.customEdit ?? undefined} saving={props.saving} onOpenChange={(open) => !open && close()} onSave={(section) => { props.save({ ...profile, content: { ...content, customSections: saveCustomSection(content.customSections, section) } }); close(); }} />
    </>
  );
}

function saveProfileEntry(props: Parameters<typeof ProfileForms>[0], entry: DatedEntry) {
  if (!props.entryEdit) return;
  const sectionId = props.entryEdit.customSectionId;
  const value = { ...entry, id: entry.id || createId("entry") };
  if (sectionId) {
    const section = props.profile.content.customSections.find((item) => item.id === sectionId);
    props.save(updateCustomEntries(props.profile, sectionId, saveEntry(section?.entries ?? [], value, "entry")));
  } else {
    const key = props.entryEdit.section;
    props.save({ ...props.profile, content: { ...props.profile.content, [key]: saveEntry(props.profile.content[key], value, key) } });
  }
  props.setEntryEdit(null);
}
