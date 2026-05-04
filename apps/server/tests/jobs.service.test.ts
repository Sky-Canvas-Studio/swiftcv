import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";

const findManyMock = mock(async () => []);
const upsertMock = mock(async (value: unknown) => value);
const getOrCreateProfileMock = mock(async () => sampleProfile);
const fetchMock = mock(async () => jsonResponse({ items: [], meta: meta(0) }));

mock.module("@db", () => ({
  default: {
    userJobInteraction: {
      findMany: findManyMock,
      upsert: upsertMock,
    },
  },
}));

mock.module("@env/server", () => ({
  env: {
    JOBLAKE_HTTP_URL: "http://joblake.test",
  },
}));

mock.module("../src/modules/profile/profile.service", () => ({
  profileService: {
    getOrCreateProfile: getOrCreateProfileMock,
  },
}));

beforeEach(() => {
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

afterEach(() => {
  findManyMock.mockReset();
  upsertMock.mockReset();
  getOrCreateProfileMock.mockReset();
  fetchMock.mockReset();
  getOrCreateProfileMock.mockResolvedValue(sampleProfile);
  fetchMock.mockResolvedValue(jsonResponse({ items: [], meta: meta(0) }));
});

describe("profile-to-resume mapper", () => {
  it("maps profile content into Joblake resume JSON and preserves custom skill groups", async () => {
    const { mapProfileToResume } = await import("../src/modules/jobs/profile-resume.mapper");

    const resume = mapProfileToResume(sampleProfile);

    expect(resume.personal_info.name).toBe("Khalid Khan");
    expect(resume.summary).toContain("Full-stack TypeScript");
    expect(resume.skills.frontend).toEqual(["React", "Next.js"]);
    expect(resume.skills.blockchain).toEqual(["Solidity"]);
    expect(resume.work_experience[0]).toMatchObject({
      company: "Interspeed",
      role: "Full-Stack Engineer",
    });
  });
});

describe("jobsService", () => {
  it("hides dismissed jobs from the all tab", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({
      items: [job("fp-1", "Visible job"), job("fp-2", "Dismissed job")],
      meta: meta(2),
    }));
    findManyMock.mockResolvedValueOnce([
      {
        jobKey: "fp-2",
        clickedAt: null,
        dismissedAt: new Date("2026-05-01T00:00:00.000Z"),
        lastVisitedAt: null,
      },
    ]);

    const { jobsService } = await import("../src/modules/jobs/jobs.service");
    const result = await jobsService.listMyJobs({ id: "user-1" }, { tab: "all", page: 1, per_page: 20 });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].fingerprint).toBe("fp-1");
    expect(result.meta.total).toBe(1);
  });

  it("filters clicked and dismissed tabs from persisted interactions", async () => {
    fetchMock.mockImplementation(async () => jsonResponse({
      items: [job("fp-1", "Clicked job"), job("fp-2", "Dismissed job")],
      meta: meta(2),
    }));
    findManyMock.mockResolvedValue([
      {
        jobKey: "fp-1",
        clickedAt: new Date("2026-05-01T00:00:00.000Z"),
        dismissedAt: null,
        lastVisitedAt: new Date("2026-05-01T00:00:00.000Z"),
      },
      {
        jobKey: "fp-2",
        clickedAt: null,
        dismissedAt: new Date("2026-05-02T00:00:00.000Z"),
        lastVisitedAt: null,
      },
    ]);

    const { jobsService } = await import("../src/modules/jobs/jobs.service");
    const clicked = await jobsService.listMyJobs({ id: "user-1" }, { tab: "clicked", page: 1, per_page: 20 });
    const dismissed = await jobsService.listMyJobs({ id: "user-1" }, { tab: "dismissed", page: 1, per_page: 20 });

    expect(clicked.items.map((item) => item.fingerprint)).toEqual(["fp-1"]);
    expect(dismissed.items.map((item) => item.fingerprint)).toEqual(["fp-2"]);
  });

  it("upserts visit, dismiss, and restore actions per user and job", async () => {
    const { jobsService } = await import("../src/modules/jobs/jobs.service");

    await jobsService.recordAction("user-1", { action: "clicked_to_apply", fingerprint: "fp-1", sourceJobId: "source-1" });
    await jobsService.recordAction("user-1", { action: "dismiss", fingerprint: "fp-1" });
    await jobsService.recordAction("user-1", { action: "restore", fingerprint: "fp-1" });

    expect(upsertMock).toHaveBeenCalledTimes(3);
    expect(upsertMock.mock.calls[0]?.[0]).toMatchObject({
      where: { userId_jobKey: { userId: "user-1", jobKey: "fp-1" } },
      update: { sourceJobId: "source-1" },
    });
    expect(upsertMock.mock.calls[0]?.[0].update.clickedAt).toBeInstanceOf(Date);
    expect(upsertMock.mock.calls[1]?.[0].update.dismissedAt).toBeInstanceOf(Date);
    expect(upsertMock.mock.calls[2]?.[0].update.dismissedAt).toBeNull();
  });
});

const sampleProfile = {
  summary: "Full-stack TypeScript engineer.",
  content: {
    personal: {
      fullName: "Khalid Khan",
      headline: "Full-stack engineer",
      summary: "Profile summary",
      nationality: "Bangladeshi",
    },
    contact: {
      email: "khalid@example.com",
      phone: "+880",
      address: "Dhaka",
      city: "Dhaka",
      country: "Bangladesh",
    },
    experience: [
      {
        title: "Full-Stack Engineer",
        organization: "Interspeed",
        location: "Dhaka",
        startDate: "2023-05",
        endDate: "",
        current: true,
        description: "Built SaaS systems.\nIntegrated queues.",
      },
    ],
    education: [],
    projects: [],
    languages: [],
    recommendations: [],
    skills: [
      { name: "Frontend", skills: ["React", "Next.js"] },
      { name: "Blockchain", skills: ["Solidity"] },
    ],
  },
};

function job(fingerprint: string, title: string) {
  return {
    fingerprint,
    source_job_id: fingerprint,
    source: "remoteok",
    job_title: title,
    match: { score: 80, level: "strong", rejected: false },
  };
}

function meta(total: number) {
  return {
    total,
    page: 1,
    per_page: 20,
    total_pages: total ? 1 : 0,
    has_next: false,
    has_prev: false,
    sort: "score_desc",
    filters: {},
  };
}

function jsonResponse(value: unknown) {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
