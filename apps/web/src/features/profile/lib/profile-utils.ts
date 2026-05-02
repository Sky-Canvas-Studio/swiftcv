import { emptyContent, sectionOrder } from "./defaults";
import type {
  ContactInfo,
  CustomSection,
  DatedEntry,
  LanguageSkill,
  PersonalInfo,
  ProfileContent,
  Recommendation,
  ResumeProfile,
  SectionId,
  SkillCategory,
} from "./types";

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
    personal: normalizePersonal(value.personal),
    contact: normalizeContact(value.contact),
    education: normalizeEntries(value.education),
    experience: normalizeEntries(value.experience),
    skills: normalizeSkills(value.skills),
    languages: normalizeLanguages(value.languages),
    projects: normalizeEntries(value.projects),
    recommendations: normalizeRecommendations(value.recommendations),
    customSections: normalizeCustomSections(value.customSections),
  };
}

export function normalizeProfile(data: unknown): ResumeProfile {
  const profile = data as ResumeProfile;
  return {
    id: String(profile.id ?? ""),
    userId: String(profile.userId ?? ""),
    language: String(profile.language ?? "en"),
    photoUrl: profile.photoUrl ? toText(profile.photoUrl) : null,
    headline: profile.headline ? toText(profile.headline) : null,
    summary: profile.summary ? toText(profile.summary) : null,
    content: normalizeContent(profile.content),
    sectionOrder: normalizeOrder(profile.sectionOrder),
  };
}

export function toText(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  if (value === null || value === undefined) return "";
  return String(value);
}

function normalizePersonal(value: unknown): PersonalInfo {
  const item = { ...emptyContent.personal, ...(value as Partial<PersonalInfo>) };
  return {
    fullName: toText(item.fullName),
    headline: toText(item.headline),
    summary: toText(item.summary),
    dateOfBirth: toText(item.dateOfBirth),
    cityOfBirth: toText(item.cityOfBirth),
    countryOfBirth: toText(item.countryOfBirth),
    nationality: toText(item.nationality),
  };
}

function normalizeContact(value: unknown): ContactInfo {
  const item = { ...emptyContent.contact, ...(value as Partial<ContactInfo>) };
  const links = Array.isArray(item.links) ? item.links : [];
  return {
    email: toText(item.email),
    phone: toText(item.phone),
    website: toText(item.website),
    address: toText(item.address),
    city: toText(item.city),
    country: toText(item.country),
    links: links.map((link) => ({
      id: toText(link.id),
      label: toText(link.label),
      url: toText(link.url),
    })),
  };
}

function normalizeEntries(value: unknown): DatedEntry[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => {
    const item = entry as Partial<DatedEntry>;
    return {
      id: toText(item.id),
      title: toText(item.title),
      organization: toText(item.organization),
      location: toText(item.location),
      startDate: toText(item.startDate),
      endDate: toText(item.endDate),
      current: Boolean(item.current),
      description: toText(item.description),
    };
  });
}

function normalizeSkills(value: unknown): SkillCategory[] {
  if (!Array.isArray(value)) return [];
  return value.map((category) => {
    const item = category as Partial<SkillCategory>;
    return {
      id: toText(item.id),
      name: toText(item.name),
      skills: Array.isArray(item.skills) ? item.skills.map(toText) : [],
    };
  });
}

function normalizeLanguages(value: unknown): LanguageSkill[] {
  if (!Array.isArray(value)) return [];
  return value.map((language) => {
    const item = language as Partial<LanguageSkill>;
    return {
      id: toText(item.id),
      language: toText(item.language),
      level: toText(item.level),
      listening: toText(item.listening),
      reading: toText(item.reading),
      spokenInteraction: toText(item.spokenInteraction),
      spokenProduction: toText(item.spokenProduction),
      writing: toText(item.writing),
    };
  });
}

function normalizeRecommendations(value: unknown): Recommendation[] {
  if (!Array.isArray(value)) return [];
  return value.map((recommendation) => {
    const item = recommendation as Partial<Recommendation>;
    return {
      id: toText(item.id),
      name: toText(item.name),
      role: toText(item.role),
      email: toText(item.email),
      note: toText(item.note),
    };
  });
}

function normalizeCustomSections(value: unknown): CustomSection[] {
  if (!Array.isArray(value)) return [];
  return value.map((section) => {
    const item = section as Partial<CustomSection>;
    return {
      id: toText(item.id),
      title: toText(item.title),
      entries: normalizeEntries(item.entries),
    };
  });
}

function normalizeOrder(order: unknown): SectionId[] {
  const incoming = Array.isArray(order) ? (order as SectionId[]) : [];
  const allowed = new Set(sectionOrder);
  const filtered = incoming.filter((item) => allowed.has(item));
  return [...filtered, ...sectionOrder.filter((item) => !filtered.includes(item))];
}
