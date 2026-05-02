export type SectionId =
  | "personal"
  | "contact"
  | "education"
  | "experience"
  | "skills"
  | "languages"
  | "projects"
  | "recommendations"
  | "custom";

export type LinkItem = { id: string; label: string; url: string };

export type PersonalInfo = {
  fullName: string;
  headline: string;
  summary: string;
  dateOfBirth: string;
  cityOfBirth: string;
  countryOfBirth: string;
  nationality: string;
};

export type ContactInfo = {
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  country: string;
  links: LinkItem[];
};

export type DatedEntry = {
  id: string;
  title: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type SkillCategory = { id: string; name: string; skills: string[] };

export type LanguageSkill = {
  id: string;
  language: string;
  level: string;
  listening: string;
  reading: string;
  spokenInteraction: string;
  spokenProduction: string;
  writing: string;
};

export type Recommendation = {
  id: string;
  name: string;
  role: string;
  email: string;
  note: string;
};

export type CustomSection = {
  id: string;
  title: string;
  entries: DatedEntry[];
};

export type ProfileContent = {
  personal: PersonalInfo;
  contact: ContactInfo;
  education: DatedEntry[];
  experience: DatedEntry[];
  skills: SkillCategory[];
  languages: LanguageSkill[];
  projects: DatedEntry[];
  recommendations: Recommendation[];
  customSections: CustomSection[];
};

export type ResumeProfile = {
  id: string;
  userId: string;
  language: string;
  photoUrl: string | null;
  headline: string | null;
  summary: string | null;
  content: ProfileContent;
  sectionOrder: SectionId[];
};
