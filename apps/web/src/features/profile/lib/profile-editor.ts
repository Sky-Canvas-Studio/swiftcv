import { toast } from "sonner";
import { createId, moveItem } from "./profile-utils";
import type {
  CustomSection,
  DatedEntry,
  LanguageSkill,
  ProfileContent,
  Recommendation,
  ResumeProfile,
  SectionId,
} from "./types";

export function updateContent(
  profile: ResumeProfile,
  content: ProfileContent,
): ResumeProfile {
  return { ...profile, content };
}

export function saveEntry(
  entries: DatedEntry[],
  entry: DatedEntry,
  prefix: string,
) {
  const value = { ...entry, id: entry.id || createId(prefix) };
  return entries.some((item) => item.id === value.id)
    ? entries.map((item) => (item.id === value.id ? value : item))
    : [...entries, value];
}

export function saveLanguage(items: LanguageSkill[], item: LanguageSkill) {
  const value = { ...item, id: item.id || createId("language") };
  return items.some((entry) => entry.id === value.id)
    ? items.map((entry) => (entry.id === value.id ? value : entry))
    : [...items, value];
}

export function saveRecommendation(items: Recommendation[], item: Recommendation) {
  const value = { ...item, id: item.id || createId("recommendation") };
  return items.some((entry) => entry.id === value.id)
    ? items.map((entry) => (entry.id === value.id ? value : entry))
    : [...items, value];
}

export function saveCustomSection(items: CustomSection[], item: CustomSection) {
  const value = { ...item, id: item.id || createId("custom") };
  return items.some((entry) => entry.id === value.id)
    ? items.map((entry) => (entry.id === value.id ? value : entry))
    : [...items, value];
}

export function reorderSection(profile: ResumeProfile, from: number, to: number) {
  if (to < 0 || to >= profile.sectionOrder.length) return profile;
  return { ...profile, sectionOrder: moveItem<SectionId>(profile.sectionOrder, from, to) };
}

export function showSaved() {
  toast.success("Profile saved");
}
