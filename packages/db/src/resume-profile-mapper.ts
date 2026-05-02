export type ResumeJson = {
  personal_info: {
    name: string;
    date_of_birth?: string;
    place_of_birth?: string;
    nationality?: string;
    contact: { phone?: string; email?: string; address?: string };
  };
  summary: string;
  education: Array<Record<string, unknown>>;
  work_experience: Array<Record<string, unknown>>;
  skills: Record<string, string[]>;
  languages: Array<{ language: string; proficiency: string }>;
  projects: Array<Record<string, unknown>>;
  recommendations: Array<{ name: string; role: string; contact: string }>;
};

export const seededSectionOrder = [
  "personal",
  "contact",
  "education",
  "experience",
  "work",
  "skills",
  "languages",
  "projects",
  "recommendations",
  "custom",
];

export function buildProfileContent(resume: ResumeJson) {
  const place = splitPlace(resume.personal_info.place_of_birth);
  const workEntries = resume.work_experience.filter((item) => item.company === "Interspeed");
  const experienceEntries = resume.work_experience.filter((item) => item.company !== "Interspeed");

  return {
    personal: {
      fullName: resume.personal_info.name,
      headline: "Full-Stack TypeScript Engineer",
      summary: cleanText(resume.summary),
      dateOfBirth: resume.personal_info.date_of_birth ?? "",
      cityOfBirth: place.city,
      countryOfBirth: place.country,
      nationality: resume.personal_info.nationality ?? "",
    },
    contact: {
      email: resume.personal_info.contact.email ?? "",
      phone: resume.personal_info.contact.phone ?? "",
      website: "",
      address: resume.personal_info.contact.address ?? "",
      city: "Tangail",
      country: "Bangladesh",
      links: [],
    },
    education: resume.education.map((item, index) => toEducation(item, index)),
    experience: experienceEntries.map((item, index) => toWorkEntry(item, index, "experience")),
    work: workEntries.map((item, index) => toWorkEntry(item, index, "work")),
    skills: Object.entries(resume.skills).map(([name, skills]) => ({
      id: `skill-${name}`,
      name: toTitle(name),
      skills,
    })),
    languages: resume.languages.map((item, index) => ({
      id: `language-${index + 1}`,
      language: item.language,
      level: item.proficiency,
      listening: "",
      reading: "",
      spokenInteraction: "",
      spokenProduction: "",
      writing: "",
    })),
    projects: resume.projects.map((item, index) => toProject(item, index)),
    recommendations: resume.recommendations.map((item, index) => ({
      id: `recommendation-${index + 1}`,
      name: item.name,
      role: item.role,
      email: item.contact,
      note: "",
    })),
    customSections: [],
  };
}

function toEducation(item: Record<string, unknown>, index: number) {
  const dates = splitPeriod(String(item.period ?? ""));
  return {
    id: `education-${index + 1}`,
    title: [item.degree, item.field_of_study ?? item.group].filter(Boolean).join(" - "),
    organization: String(item.institution ?? ""),
    location: "Tangail, Bangladesh",
    startDate: dates.start,
    endDate: dates.end,
    current: false,
    description: cleanText([item.grade, item.details].filter(Boolean).join("\n")),
  };
}

function toWorkEntry(item: Record<string, unknown>, index: number, prefix: string) {
  const dates = splitPeriod(String(item.period ?? ""));
  const responsibilities = (item.responsibilities ?? item.projects ?? []) as Array<Record<string, unknown> | string>;
  return {
    id: `${prefix}-${index + 1}`,
    title: String(item.role ?? ""),
    organization: String(item.company ?? ""),
    location: String(item.location ?? ""),
    startDate: dates.start,
    endDate: dates.end,
    current: dates.current,
    description: cleanText(String(item.details ?? formatList(responsibilities))),
  };
}

function toProject(item: Record<string, unknown>, index: number) {
  const dates = splitPeriod(String(item.period ?? ""));
  return {
    id: `project-${index + 1}`,
    title: String(item.name ?? ""),
    organization: ((item.stack as string[] | undefined) ?? []).join(", "),
    location: "",
    startDate: dates.start,
    endDate: dates.end,
    current: dates.current,
    description: cleanText(String(item.description ?? "")),
  };
}

function splitPeriod(period: string) {
  const [startRaw = "", endRaw = ""] = period.split(" - ");
  return {
    start: toMonth(startRaw),
    end: /current/i.test(endRaw) ? "" : toMonth(endRaw),
    current: /current/i.test(endRaw),
  };
}

function toMonth(value: string) {
  const [day, month, year] = value.split("/");
  if (!day || !month || !year) return value;
  return `${year}-${month.padStart(2, "0")}`;
}

function splitPlace(value = "") {
  const [city = "", country = ""] = value.split(",").map((item) => item.trim());
  return { city, country };
}

function formatList(items: Array<Record<string, unknown> | string>) {
  return items.map((item) => {
    if (typeof item === "string") return item;
    return [item.name, item.details].filter(Boolean).join(": ");
  }).join("\n");
}

export function cleanText(value: string) {
  return value.replace(/\[cite:[^\]]+\]/g, "").replace(/\s+/g, " ").trim();
}

function toTitle(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
