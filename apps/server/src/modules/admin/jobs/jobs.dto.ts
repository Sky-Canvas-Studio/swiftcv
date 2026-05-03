import { t } from "elysia";

export const JobsTitleMatchDto = t.Union([
  t.Literal("contains"),
  t.Literal("all_words"),
  t.Literal("phrase"),
  t.Literal("semantic"),
]);

export const JobsSkillMatchDto = t.Union([
  t.Literal("any"),
  t.Literal("all"),
]);

export const JobsSortDto = t.Union([
  t.Literal("published_at_desc"),
  t.Literal("extracted_at_desc"),
  t.Literal("score_desc"),
  t.Literal("semantic_desc"),
  t.Literal("title_asc"),
]);

export const JobsListQueryDto = t.Object({
  page: t.Optional(t.Numeric({ minimum: 1, default: 1 })),
  per_page: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 20 })),
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

export type JobsListQuery = typeof JobsListQueryDto.static;
