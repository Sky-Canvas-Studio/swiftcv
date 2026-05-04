type JsonObject = Record<string, unknown>;

const SKILL_BUCKETS = new Map([
  ["languages", "languages"],
  ["language", "languages"],
  ["frontend", "frontend"],
  ["front end", "frontend"],
  ["backend", "backend"],
  ["back end", "backend"],
  ["database", "database"],
  ["databases", "database"],
  ["devops", "devops"],
  ["dev ops", "devops"],
]);

export function mapProfileToResume(profile: { summary?: string | null; content: unknown }) {
  const content = asObject(profile.content);
  const personal = asObject(content.personal);
  const contact = asObject(content.contact);

  return {
    personal_info: {
      name: text(personal.fullName),
      nationality: text(personal.nationality),
      place_of_birth: [text(personal.cityOfBirth), text(personal.countryOfBirth)]
        .filter(Boolean)
        .join(", ") || null,
      date_of_birth: text(personal.dateOfBirth),
      contact: {
        email: text(contact.email),
        phone: text(contact.phone),
        address: [text(contact.address), text(contact.city), text(contact.country)]
          .filter(Boolean)
          .join(", ") || null,
      },
    },
    summary: profile.summary || text(personal.summary) || text(personal.headline) || "",
    education: datedEntries(content.education).map((item) => ({
      institution: item.organization,
      degree: item.title,
      period: period(item),
      details: item.description,
      field_of_study: "",
      grade: "",
    })),
    work_experience: datedEntries(content.experience).map((item) => ({
      company: item.organization,
      role: item.title,
      period: period(item),
      location: item.location,
      responsibilities: lines(item.description),
    })),
    skills: mapSkills(content.skills),
    languages: asArray(content.languages).map((item) => {
      const language = asObject(item);
      return {
        language: text(language.language) || "Unknown",
        proficiency: text(language.level),
      };
    }),
    projects: datedEntries(content.projects).map((item) => ({
      name: item.title,
      period: period(item),
      description: item.description,
      stack: [],
    })),
    recommendations: asArray(content.recommendations).map((item) => {
      const recommendation = asObject(item);
      return {
        name: text(recommendation.name),
        role: text(recommendation.role),
        contact: text(recommendation.email),
      };
    }),
  };
}

function mapSkills(value: unknown) {
  const skills: Record<string, string[]> = {
    languages: [],
    frontend: [],
    backend: [],
    database: [],
    devops: [],
  };

  for (const item of asArray(value)) {
    const group = asObject(item);
    const name = text(group.name) || "other";
    const bucket = SKILL_BUCKETS.get(name.toLowerCase()) ?? slug(name);
    skills[bucket] = unique([...(skills[bucket] ?? []), ...asArray(group.skills).map(text).filter(Boolean)]);
  }

  return skills;
}

function datedEntries(value: unknown) {
  return asArray(value).map((item) => {
    const entry = asObject(item);
    return {
      title: text(entry.title),
      organization: text(entry.organization),
      location: text(entry.location),
      startDate: text(entry.startDate),
      endDate: text(entry.endDate),
      current: Boolean(entry.current),
      description: text(entry.description),
    };
  });
}

function period(item: { startDate: string; endDate: string; current: boolean }) {
  return [item.startDate, item.current ? "Current" : item.endDate].filter(Boolean).join(" - ");
}

function lines(value: string) {
  return value.split(/\n+/).map((line) => line.trim()).filter(Boolean);
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "other";
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asObject(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonObject) : {};
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
