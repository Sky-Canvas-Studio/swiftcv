export type MonitorRunStatus = "running" | "completed";
export type MonitorSourceStatus = "idle" | "running" | "completed" | "failed";
export type MonitorSourceRunStatus = "pending" | "running" | "completed" | "failed";

export type MonitorChannel =
  | "overview"
  | "runs"
  | "sources"
  | `source:${string}`
  | `run:${string}`;

export type MonitorEventType =
  | "run.started"
  | "source.started"
  | "source.finished"
  | "source.failed"
  | "job.seen"
  | "job.normalized"
  | "job.matched"
  | "job.upserted"
  | "run.finished";

export interface MonitorDimensions {
  work_mode: Record<string, number>;
  remote_scope: Record<string, number>;
  seniority: Record<string, number>;
}

export interface MonitorQueues {
  waiting_for_normalize: number;
  waiting_for_match: number;
  waiting_for_upsert: number;
}

export interface MonitorTotals {
  sources_total: number;
  sources_completed: number;
  sources_failed: number;
  jobs_collected: number;
  jobs_seen: number;
  jobs_normalized: number;
  jobs_matched: number;
  jobs_upserted: number;
  jobs_inserted: number;
  jobs_updated: number;
  jobs_rejected: number;
  alerts: number;
}

export interface MonitorRunSourceSnapshot {
  status: MonitorSourceRunStatus;
  collected: number;
  duration_ms: number | null;
  error: string | null;
}

export interface MonitorSourceSnapshot {
  source: string;
  status: MonitorSourceStatus;
  last_run_id: string | null;
  last_started_at: string | null;
  last_finished_at: string | null;
  last_duration_ms: number | null;
  last_collected: number;
  last_error: string | null;
  consecutive_failures: number;
  total_failures: number;
  total_successes: number;
}

export interface MonitorRunSnapshot {
  run_id: string;
  status: MonitorRunStatus;
  trigger: string;
  started_at: string;
  finished_at: string | null;
  current_source: string | null;
  sources_expected: string[];
  sources: Record<string, MonitorRunSourceSnapshot>;
  totals: MonitorTotals;
  match_levels: Record<string, number>;
  dimensions: MonitorDimensions;
  queues: MonitorQueues;
  errors: { source: string; error: string; timestamp: string }[];
}

export interface MonitorEvent {
  event_id: string;
  type: MonitorEventType;
  timestamp: string;
  run_id: string | null;
  source: string | null;
  data: Record<string, unknown>;
}

export interface MonitorOverviewResponse {
  current_run: MonitorRunSnapshot | null;
  sources: MonitorSourceSnapshot[];
  recent_events: MonitorEvent[];
}

export type MonitorSnapshotMessage =
  | { type: "snapshot"; query: "overview"; data: MonitorOverviewResponse }
  | { type: "snapshot"; query: "sources"; data: MonitorSourceSnapshot[] }
  | { type: "snapshot"; query: "runs"; data: MonitorRunSnapshot[] }
  | { type: "snapshot"; query: string; error: "unsupported query" };

export type MonitorServerMessage =
  | { type: "ack"; channels: string[] }
  | MonitorSnapshotMessage
  | { type: "event"; channels: MonitorChannel[]; event: MonitorEvent }
  | { type: "pong" }
  | { type: "error"; message: string };
