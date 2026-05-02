import {
  FolderKanban,
  GraduationCap,
  Languages,
  Mail,
  Puzzle,
  Sparkles,
  Star,
  User,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { sectionLabels } from "../lib/defaults";
import type { CustomSection, DatedEntry, LanguageSkill, Recommendation, ResumeProfile, SectionId } from "../lib/types";
import { CustomSectionsView } from "./custom-sections-view";
import { EntryList } from "./entry-list";
import { InfoGrid } from "./info-grid";
import { LanguageList } from "./language-list";
import { ProfileSectionCard } from "./profile-section-card";
import { RecommendationList } from "./recommendation-list";
import { SkillsView } from "./skills-view";

const icons: Record<SectionId, ReactNode> = {
  personal: <User className="size-4" />,
  contact: <Mail className="size-4" />,
  education: <GraduationCap className="size-4" />,
  experience: <Sparkles className="size-4" />,
  skills: <Star className="size-4" />,
  languages: <Languages className="size-4" />,
  projects: <FolderKanban className="size-4" />,
  recommendations: <Users className="size-4" />,
  custom: <Puzzle className="size-4" />,
};

export function ProfileSections(props: {
  profile: ResumeProfile;
  onMoveSection: (from: number, to: number) => void;
  onEditPersonal: () => void;
  onEditContact: () => void;
  onEditSkills: () => void;
  onAddEntry: (section: "education" | "experience" | "projects") => void;
  onEditEntry: (section: "education" | "experience" | "projects", entry: DatedEntry) => void;
  onDeleteEntry: (section: "education" | "experience" | "projects", id: string) => void;
  onMoveEntry: (section: "education" | "experience" | "projects", from: number, to: number) => void;
  onAddLanguage: () => void;
  onEditLanguage: (item: LanguageSkill) => void;
  onDeleteLanguage: (id: string) => void;
  onMoveLanguage: (from: number, to: number) => void;
  onAddRecommendation: () => void;
  onEditRecommendation: (item: Recommendation) => void;
  onDeleteRecommendation: (id: string) => void;
  onMoveRecommendation: (from: number, to: number) => void;
  onAddCustomSection: () => void;
  onEditCustomSection: (section: CustomSection) => void;
  onDeleteCustomSection: (id: string) => void;
  onMoveCustomSection: (from: number, to: number) => void;
  onAddCustomEntry: (section: CustomSection) => void;
  onEditCustomEntry: (section: CustomSection, entry: DatedEntry) => void;
  onDeleteCustomEntry: (section: CustomSection, id: string) => void;
  onMoveCustomEntry: (section: CustomSection, from: number, to: number) => void;
}) {
  return props.profile.sectionOrder.map((section, index) => (
    <ProfileSectionCard
      key={section}
      id={`profile-${section}`}
      title={sectionLabels[section]}
      icon={icons[section]}
      canMoveUp={index > 0}
      canMoveDown={index < props.profile.sectionOrder.length - 1}
      onMoveUp={() => props.onMoveSection(index, index - 1)}
      onMoveDown={() => props.onMoveSection(index, index + 1)}
      onAdd={getAddHandler(section, props)}
      addLabel={section === "skills" ? "Update" : "Add new"}
    >
      {renderSection(section, props)}
    </ProfileSectionCard>
  ));
}

function getAddHandler(section: SectionId, props: Parameters<typeof ProfileSections>[0]) {
  if (section === "personal") return props.onEditPersonal;
  if (section === "contact") return props.onEditContact;
  if (section === "skills") return props.onEditSkills;
  if (section === "languages") return props.onAddLanguage;
  if (section === "recommendations") return props.onAddRecommendation;
  if (section === "custom") return props.onAddCustomSection;
  if (section === "education" || section === "experience" || section === "projects") {
    return () => props.onAddEntry(section);
  }
}

function renderSection(section: SectionId, props: Parameters<typeof ProfileSections>[0]) {
  const content = props.profile.content;
  if (section === "personal") {
    return <PersonalInfo content={content.personal} onEdit={props.onEditPersonal} />;
  }
  if (section === "contact") {
    return <ContactInfo profile={props.profile} onEdit={props.onEditContact} />;
  }
  if (section === "skills") return <SkillsView categories={content.skills} />;
  if (section === "languages") {
    return <LanguageList languages={content.languages} onEdit={props.onEditLanguage} onDelete={props.onDeleteLanguage} onMove={props.onMoveLanguage} />;
  }
  if (section === "recommendations") {
    return <RecommendationList recommendations={content.recommendations} onEdit={props.onEditRecommendation} onDelete={props.onDeleteRecommendation} onMove={props.onMoveRecommendation} />;
  }
  if (section === "custom") {
    return <CustomSectionsView sections={content.customSections} onAddEntry={props.onAddCustomEntry} onEditSection={props.onEditCustomSection} onDeleteSection={props.onDeleteCustomSection} onMoveSection={props.onMoveCustomSection} onEditEntry={props.onEditCustomEntry} onDeleteEntry={props.onDeleteCustomEntry} onMoveEntry={props.onMoveCustomEntry} />;
  }
  return <EntryList entries={content[section]} emptyText={`Add your ${sectionLabels[section].toLowerCase()} entries.`} onEdit={(entry) => props.onEditEntry(section, entry)} onDelete={(id) => props.onDeleteEntry(section, id)} onMove={(from, to) => props.onMoveEntry(section, from, to)} />;
}

function PersonalInfo(props: { content: ResumeProfile["content"]["personal"]; onEdit: () => void }) {
  return (
    <div>
      <InfoGrid items={[
        { label: "Full name", value: props.content.fullName },
        { label: "Headline", value: props.content.headline },
        { label: "Nationality", value: props.content.nationality },
        { label: "Date of birth", value: props.content.dateOfBirth },
        { label: "Birthplace", value: [props.content.cityOfBirth, props.content.countryOfBirth].filter(Boolean).join(", ") },
      ]} />
      {props.content.summary && <p className="border-t p-5 text-sm">{props.content.summary}</p>}
      <Button className="m-5 mt-0" variant="outline" size="sm" onClick={props.onEdit}>Edit personal information</Button>
    </div>
  );
}

function ContactInfo(props: { profile: ResumeProfile; onEdit: () => void }) {
  const contact = props.profile.content.contact;
  return (
    <div>
      <InfoGrid items={[
        { label: "Email", value: contact.email },
        { label: "Phone", value: contact.phone },
        { label: "Website", value: contact.website },
        { label: "Location", value: [contact.city, contact.country].filter(Boolean).join(", ") },
        { label: "Address", value: contact.address },
      ]} />
      {contact.links.length > 0 && <div className="flex flex-wrap gap-2 border-t p-5">{contact.links.map((link) => <a key={link.id} className="text-sm text-primary underline-offset-4 hover:underline" href={link.url}>{link.label || link.url}</a>)}</div>}
      <Button className="m-5 mt-0" variant="outline" size="sm" onClick={props.onEdit}>Edit contact</Button>
    </div>
  );
}
