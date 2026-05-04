import { t } from "elysia";
import { JobsSkillMatchDto, JobsSortDto, JobsTitleMatchDto } from "../admin/jobs/jobs.dto";

export const MyJobsTabDto = t.Union([
  t.Literal("all"),
  t.Literal("clicked"),
  t.Literal("dismissed"),
]);

export const MyJobsQueryDto = t.Object({
  page: t.Optional(t.Numeric({ minimum: 1, default: 1 })),
  per_page: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 20 })),
  tab: t.Optional(MyJobsTabDto),
  q: t.Optional(t.String()),
  title: t.Optional(t.String()),
  title_match: t.Optional(JobsTitleMatchDto),
  semantic: t.Optional(t.Boolean()),
  source: t.Optional(t.String()),
  company: t.Optional(t.String()),
  publisher: t.Optional(t.String()),
  category: t.Optional(t.String()),
  employment_type: t.Optional(t.String()),
  is_remote: t.Optional(t.Boolean()),
  country: t.Optional(t.String()),
  state: t.Optional(t.String()),
  city: t.Optional(t.String()),
  work_mode: t.Optional(t.String()),
  remote_scope: t.Optional(t.String()),
  seniority: t.Optional(t.String()),
  match_level: t.Optional(t.String()),
  rejected: t.Optional(t.Boolean()),
  min_score: t.Optional(t.Numeric({ minimum: 0, maximum: 100 })),
  max_score: t.Optional(t.Numeric({ minimum: 0, maximum: 100 })),
  skills: t.Optional(t.String()),
  skill_match: t.Optional(JobsSkillMatchDto),
  date_from: t.Optional(t.String()),
  date_to: t.Optional(t.String()),
  published_from: t.Optional(t.String()),
  published_to: t.Optional(t.String()),
  posted_within_hours: t.Optional(t.Numeric({ minimum: 1 })),
  salary_present: t.Optional(t.Boolean()),
  sort: t.Optional(JobsSortDto),
});

export const MyJobActionDto = t.Object({
  action: t.Union([
    t.Literal("clicked_to_apply"),
    t.Literal("dismiss"),
    t.Literal("restore"),
  ]),
  jobKey: t.Optional(t.String()),
  source: t.Optional(t.Union([t.String(), t.Null()])),
  sourceJobId: t.Optional(t.Union([t.String(), t.Null()])),
  fingerprint: t.Optional(t.Union([t.String(), t.Null()])),
});

export const MyJobDetailQueryDto = t.Object({
  fingerprint: t.Optional(t.String()),
  source_job_id: t.Optional(t.String()),
});

export type MyJobsQuery = typeof MyJobsQueryDto.static;
export type MyJobActionInput = typeof MyJobActionDto.static;
export type MyJobDetailQuery = typeof MyJobDetailQueryDto.static;
