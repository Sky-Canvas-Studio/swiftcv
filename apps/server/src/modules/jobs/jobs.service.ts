import { env } from "@env/server";
import prisma from "@db";
import { profileService } from "../profile/profile.service";
import { mapProfileToResume } from "./profile-resume.mapper";
import type { MyJobActionInput, MyJobDetailQuery, MyJobsQuery } from "./jobs.dto";

type JoblakeListResponse = {
  items: JoblakeJobItem[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
    sort: string;
    filters: Record<string, unknown>;
  };
};

type JoblakeJobItem = {
  source?: string | null;
  source_job_id?: string | null;
  fingerprint?: string | null;
  source_url?: string | null;
  [key: string]: unknown;
};

type Interaction = {
  jobKey: string;
  clickedAt: Date | null;
  dismissedAt: Date | null;
  lastVisitedAt: Date | null;
};

const JOBLAKE_PAGE_LIMIT = 100;

export const jobsService = {
  async listMyJobs(user: { id: string; name?: string | null; email?: string | null }, query: MyJobsQuery) {
    const tab = query.tab ?? "all";
    const page = Math.max(1, Number(query.page ?? 1));
    const perPage = Math.min(Math.max(1, Number(query.per_page ?? 20)), 100);
    const profile = await profileService.getOrCreateProfile(user);
    const resume = mapProfileToResume(profile);
    const upstream = await postJoblakeJson<JoblakeListResponse>("/jobs/match", {
      ...withoutKeys(query, ["tab"]),
      page: 1,
      per_page: JOBLAKE_PAGE_LIMIT,
      sort: query.sort ?? "score_desc",
    }, resume);
    const interactions = await prisma.userJobInteraction.findMany({
      where: { userId: user.id },
      select: {
        jobKey: true,
        clickedAt: true,
        dismissedAt: true,
        lastVisitedAt: true,
      },
    });
    const interactionMap = new Map(interactions.map((item: Interaction) => [item.jobKey, item]));
    const filtered = upstream.items
      .map((item) => ({ item, jobKey: getJobKey(item), interaction: interactionMap.get(getJobKey(item)) }))
      .filter(({ interaction }) => {
        if (tab === "clicked") return Boolean(interaction?.clickedAt) && !interaction?.dismissedAt;
        if (tab === "dismissed") return Boolean(interaction?.dismissedAt);
        return !interaction?.dismissedAt;
      })
      .map(({ item, interaction }) => ({
        ...item,
        user_job: serializeInteraction(interaction),
      }));
    const start = (page - 1) * perPage;
    const items = filtered.slice(start, start + perPage);
    const totalPages = filtered.length ? Math.ceil(filtered.length / perPage) : 0;

    return {
      items,
      meta: {
        ...upstream.meta,
        total: filtered.length,
        page,
        per_page: perPage,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1 && totalPages > 0,
        filters: { ...upstream.meta.filters, tab },
      },
    };
  },

  async recordAction(userId: string, input: MyJobActionInput) {
    const jobKey = input.jobKey || input.fingerprint || input.sourceJobId;
    if (!jobKey) {
      throw new Error("Job key is required");
    }

    const now = new Date();
    const metadata = {
      source: input.source ?? undefined,
      sourceJobId: input.sourceJobId ?? undefined,
      fingerprint: input.fingerprint ?? undefined,
    };
    const actionData =
      input.action === "clicked_to_apply"
        ? { clickedAt: now, lastVisitedAt: now }
        : input.action === "dismiss"
          ? { dismissedAt: now }
          : { dismissedAt: null };

    return prisma.userJobInteraction.upsert({
      where: { userId_jobKey: { userId, jobKey } },
      update: { ...metadata, ...actionData },
      create: {
        userId,
        jobKey,
        ...metadata,
        ...actionData,
      },
    });
  },

  async getMyJobDetail(query: MyJobDetailQuery) {
    return getJoblakeJson("/jobs/detail", query);
  },
};

async function postJoblakeJson<T>(path: string, query: Record<string, unknown>, body: unknown) {
  const response = await fetch(buildJoblakeUrl(path, query), {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return parseJoblakeResponse<T>(response);
}

async function getJoblakeJson<T>(path: string, query: Record<string, unknown>) {
  const response = await fetch(buildJoblakeUrl(path, query), {
    method: "GET",
    headers: { accept: "application/json" },
  });
  return parseJoblakeResponse<T>(response);
}

async function parseJoblakeResponse<T>(response: Response) {
  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || "Joblake request failed");
  }
  return JSON.parse(text) as T;
}

function buildJoblakeUrl(path: string, query: Record<string, unknown>) {
  const url = new URL(path, env.JOBLAKE_HTTP_URL);
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  return url;
}

function getJobKey(item: JoblakeJobItem) {
  return String(item.fingerprint || item.source_job_id || "");
}

function serializeInteraction(interaction: Interaction | undefined) {
  return {
    clicked_at: interaction?.clickedAt?.toISOString() ?? null,
    dismissed_at: interaction?.dismissedAt?.toISOString() ?? null,
    last_visited_at: interaction?.lastVisitedAt?.toISOString() ?? null,
  };
}

function withoutKeys<T extends Record<string, unknown>>(value: T, keys: string[]) {
  return Object.fromEntries(Object.entries(value).filter(([key]) => !keys.includes(key)));
}
