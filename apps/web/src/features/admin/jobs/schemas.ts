import { z } from "zod";

const dateStringSchema = z
  .union([z.string(), z.date()])
  .nullish()
  .transform((value) => {
    if (!value) return null;
    return value instanceof Date ? value.toISOString() : value;
  });

const jobItemSchema = z.object({
  source: z.string().nullish().default(null),
  source_job_id: z.string().nullish().default(null),
  fingerprint: z.string().nullish().default(null),
  job_title: z.string().nullish().default(null),
  company: z.string().nullish().default(null),
  location: z.string().nullish().default(null),
  source_url: z.string().nullish().default(null),
  published_at: dateStringSchema,
  published_at_label: z.string().nullish().default(null),
  extracted_at: dateStringSchema,
  is_remote: z.boolean().default(false),
  employment_type: z.string().nullish().default(null),
  category: z.string().nullish().default(null),
  publisher: z.string().nullish().default(null),
  city: z.string().nullish().default(null),
  state: z.string().nullish().default(null),
  country: z.string().nullish().default(null),
  tech_stack: z.array(z.string()).default([]),
  salary_range: z.record(z.string(), z.unknown()).nullish().default({}),
  signals: z.record(z.string(), z.unknown()).nullish().default({}),
  match: z.record(z.string(), z.unknown()).nullish().default({}),
  semantic_similarity: z.number().nullish().default(null),
  description_preview: z.string().default(""),
});

export const jobsListSchema = z.object({
  items: z.array(jobItemSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    per_page: z.number(),
    total_pages: z.number(),
    has_next: z.boolean(),
    has_prev: z.boolean(),
    sort: z.string(),
    filters: z.record(z.string(), z.unknown()).default({}),
  }),
});
