import { z } from "zod";

const dateStringSchema = z.union([
  z.string(),
  z.date().transform((date) => date.toISOString()),
]);

const monitorTotalsSchema = z.object({
  sources_total: z.number(),
  sources_completed: z.number(),
  sources_failed: z.number(),
  jobs_collected: z.number(),
  jobs_seen: z.number(),
  jobs_normalized: z.number(),
  jobs_matched: z.number(),
  jobs_upserted: z.number(),
  jobs_inserted: z.number(),
  jobs_updated: z.number(),
  jobs_rejected: z.number(),
  alerts: z.number(),
});

const monitorSourceSchema = z.object({
  source: z.string(),
  status: z.enum(["idle", "running", "completed", "failed"]),
  last_run_id: z.string().nullable(),
  last_started_at: dateStringSchema.nullable(),
  last_finished_at: dateStringSchema.nullable(),
  last_duration_ms: z.number().nullable(),
  last_collected: z.number(),
  last_error: z.string().nullable(),
  consecutive_failures: z.number(),
  total_failures: z.number(),
  total_successes: z.number(),
});

const monitorRunSourceSchema = z.object({
  status: z.enum(["pending", "running", "completed", "failed"]),
  collected: z.number(),
  duration_ms: z.number().nullable(),
  error: z.string().nullable(),
  started_at: dateStringSchema.optional(),
  finished_at: dateStringSchema.optional(),
});

const monitorRunSchema = z.object({
  run_id: z.string(),
  status: z.enum(["running", "completed"]),
  trigger: z.string(),
  started_at: dateStringSchema,
  finished_at: dateStringSchema.nullable(),
  current_source: z.string().nullable(),
  sources_expected: z.array(z.string()),
  sources: z.record(z.string(), monitorRunSourceSchema),
  totals: monitorTotalsSchema,
  match_levels: z.record(z.string(), z.number()),
  dimensions: z.object({
    work_mode: z.record(z.string(), z.number()),
    remote_scope: z.record(z.string(), z.number()),
    seniority: z.record(z.string(), z.number()),
  }),
  queues: z.object({
    waiting_for_normalize: z.number(),
    waiting_for_match: z.number(),
    waiting_for_upsert: z.number(),
  }),
  errors: z.array(
    z.object({
      source: z.string(),
      error: z.string(),
      timestamp: dateStringSchema,
    }),
  ),
  result: z.record(z.string(), z.unknown()).optional(),
});

const monitorEventSchema = z.object({
  event_id: z.string(),
  type: z.enum([
    "run.started",
    "source.started",
    "source.finished",
    "source.failed",
    "job.seen",
    "job.normalized",
    "job.matched",
    "job.upserted",
    "run.finished",
  ]),
  timestamp: dateStringSchema,
  run_id: z.string().nullable(),
  source: z.string().nullable(),
  data: z.record(z.string(), z.unknown()),
});

export const monitorOverviewSchema = z.object({
  current_run: monitorRunSchema.nullable(),
  sources: z.array(monitorSourceSchema),
  recent_events: z.array(monitorEventSchema),
});

export const monitorSourcesSchema = z.array(monitorSourceSchema);
export const monitorRunsSchema = z.array(monitorRunSchema);

const monitorSnapshotMessageSchema = z.union([
  z.object({
    type: z.literal("snapshot"),
    query: z.literal("overview"),
    data: monitorOverviewSchema,
  }),
  z.object({
    type: z.literal("snapshot"),
    query: z.literal("sources"),
    data: monitorSourcesSchema,
  }),
  z.object({
    type: z.literal("snapshot"),
    query: z.literal("runs"),
    data: monitorRunsSchema,
  }),
  z.object({
    type: z.literal("snapshot"),
    query: z.string(),
    error: z.literal("unsupported query"),
  }),
]);

export const monitorServerMessageSchema = z.union([
  z.object({ type: z.literal("ack"), channels: z.array(z.string()) }),
  monitorSnapshotMessageSchema,
  z.object({
    type: z.literal("event"),
    channels: z.array(z.string()),
    event: monitorEventSchema,
  }),
  z.object({ type: z.literal("pong") }),
  z.object({ type: z.literal("error"), message: z.string() }),
]);
