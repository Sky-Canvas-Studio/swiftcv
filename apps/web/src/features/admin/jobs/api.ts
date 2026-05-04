import { client } from "@/lib/client";
import { jobsListSchema } from "./schemas";
import type { JobsFilters } from "./types";

export async function fetchAdminJobs(filters: JobsFilters) {
  const { data, error } = await client.admin.jobs.get({
    query: buildJobsQuery(filters),
  });

  if (error) {
    throw new Error("Failed to load jobs");
  }

  return jobsListSchema.parse(parseMaybeJson(data));
}

export function buildJobsQuery(filters: JobsFilters) {
  return compact({
    page: filters.page,
    per_page: filters.perPage,
    q: filters.q,
    title: filters.title,
    title_match: filters.titleMatch,
    semantic: filters.semantic || filters.titleMatch === "semantic" ? true : undefined,
    source: filters.source,
    skills: filters.skills,
    skill_match: filters.skillMatch,
    is_remote: filters.isRemote === "all" ? undefined : filters.isRemote === "true",
    salary_present:
      filters.salaryPresent === "all" ? undefined : filters.salaryPresent === "true",
    country: filters.country,
    min_score: filters.minScore ? Number(filters.minScore) : undefined,
    max_score: filters.maxScore ? Number(filters.maxScore) : undefined,
    published_from: toIsoStart(filters.publishedFrom),
    posted_within_hours: filters.postedWithinHours
      ? Number(filters.postedWithinHours)
      : undefined,
    sort: filters.sort,
  });
}

function compact<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter((entry) => {
      const current = entry[1];
      return current !== undefined && current !== null && current !== "";
    }),
  ) as Partial<T>;
}

function toIsoStart(value: string) {
  return value ? `${value}T00:00:00Z` : undefined;
}

function parseMaybeJson(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
