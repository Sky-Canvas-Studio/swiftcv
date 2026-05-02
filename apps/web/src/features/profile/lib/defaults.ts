import type { ProfileContent, SectionId } from "./types";

export const sectionLabels: Record<SectionId, string> = {
  personal: "Personal information",
  contact: "Contact",
  education: "Education and training",
  experience: "Work experience",
  skills: "Personal skills",
  languages: "Language skills",
  projects: "Projects",
  recommendations: "Recommendations",
  custom: "Custom sections",
};

export const sectionOrder: SectionId[] = [
  "personal",
  "contact",
  "education",
  "experience",
  "skills",
  "languages",
  "projects",
  "recommendations",
  "custom",
];

export const emptyContent: ProfileContent = {
  personal: {
    fullName: "",
    headline: "",
    summary: "",
    dateOfBirth: "",
    cityOfBirth: "",
    countryOfBirth: "",
    nationality: "",
  },
  contact: {
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    country: "",
    links: [],
  },
  education: [],
  experience: [],
  skills: [],
  languages: [],
  projects: [],
  recommendations: [],
  customSections: [],
};
