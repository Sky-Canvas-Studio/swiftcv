export const defaultSectionOrder = [
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

export function createDefaultProfileContent(user?: {
  name?: string | null;
  email?: string | null;
}) {
  return {
    personal: {
      fullName: user?.name ?? "",
      headline: "",
      summary: "",
      dateOfBirth: "",
      cityOfBirth: "",
      countryOfBirth: "",
      nationality: "",
    },
    contact: {
      email: user?.email ?? "",
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
}
