import { emptyContent, sectionOrder } from "./defaults";
import type { ProfileContent, ResumeProfile, SectionId } from "./types";

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function moveItem<T>(items: T[], from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  if (item === undefined) return items;
  next.splice(to, 0, item);
  return next;
}

export function normalizeContent(content: unknown): ProfileContent {
  const value = (content ?? {}) as Partial<ProfileContent>;
  return {
    ...emptyContent,
    ...value,
    personal: { ...emptyContent.personal, ...value.personal },
    contact: { ...emptyContent.contact, ...value.contact },
    education: value.education ?? [],
    experience: value.experience ?? [],
    work: value.work ?? [],
    skills: value.skills ?? [],
    languages: value.languages ?? [],
    projects: value.projects ?? [],
    recommendations: value.recommendations ?? [],
    customSections: value.customSections ?? [],
  };
}

export function normalizeProfile(data: unknown): ResumeProfile {
  const profile = data as ResumeProfile;
  return {
    ...profile,
    content: normalizeContent(profile.content),
    sectionOrder: normalizeOrder(profile.sectionOrder),
  };
}

function normalizeOrder(order: unknown): SectionId[] {
  const incoming = Array.isArray(order) ? (order as SectionId[]) : [];
  const allowed = new Set(sectionOrder);
  const filtered = incoming.filter((item) => allowed.has(item));
  return [...filtered, ...sectionOrder.filter((item) => !filtered.includes(item))];
}
