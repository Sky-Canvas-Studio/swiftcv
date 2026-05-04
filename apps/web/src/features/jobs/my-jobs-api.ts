import { client } from "@/lib/client";
import { buildJobsQuery } from "@/features/admin/jobs/api";
import { jobDetailSchema, jobsListSchema } from "@/features/admin/jobs/schemas";
import type { JobListItem, JobsFilters } from "@/features/admin/jobs/types";

export type MyJobsTab = "all" | "clicked" | "dismissed";
export type JobsViewMode = "grid" | "list";
export type MyJobsFilters = JobsFilters & {
  tab: MyJobsTab;
};

export async function fetchMyJobs(filters: MyJobsFilters) {
  const { data, error } = await client.jobs.my.get({
    query: {
      ...buildJobsQuery(filters),
      tab: filters.tab,
    },
  });

  if (error) {
    throw new Error("Failed to load your jobs");
  }

  return jobsListSchema.parse(parseMaybeJson(data));
}

export async function fetchMyJobDetail(job: Pick<JobListItem, "fingerprint" | "source_job_id">) {
  const { data, error } = await client.jobs.my.detail.get({
    query: {
      fingerprint: job.fingerprint ?? undefined,
      source_job_id: job.fingerprint ? undefined : job.source_job_id ?? undefined,
    },
  });

  if (error) {
    throw new Error("Failed to load job details");
  }

  return jobDetailSchema.parse(parseMaybeJson(data));
}

export async function recordMyJobAction(
  action: "clicked_to_apply" | "dismiss" | "restore",
  job: Pick<JobListItem, "fingerprint" | "source_job_id" | "source">,
) {
  const { data, error } = await client.jobs.my.actions.post({
    action,
    jobKey: job.fingerprint ?? job.source_job_id ?? undefined,
    fingerprint: job.fingerprint,
    sourceJobId: job.source_job_id,
    source: job.source,
  });

  if (error) {
    throw new Error("Failed to update job");
  }

  return data;
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
