import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import type { MonitorRunSnapshot, MonitorSourceSnapshot } from "./types";

export function SourceDetailsContent({ source }: { source: MonitorSourceSnapshot }) {
  return (
    <div className="space-y-4 rounded-md border bg-muted/20 p-3">
      <div className="grid gap-2 text-sm md:grid-cols-2">
        <DetailRow label="Status" value={<StatusBadge status={source.status} />} />
        <DetailRow label="Last Run" value={source.last_run_id ?? "N/A"} />
        <DetailRow label="Started" value={formatDate(source.last_started_at)} />
        <DetailRow label="Finished" value={formatDate(source.last_finished_at)} />
        <DetailRow label="Duration" value={formatDuration(source.last_duration_ms)} />
        <DetailRow label="Collected" value={source.last_collected} />
        <DetailRow label="Failures" value={`${source.consecutive_failures} consecutive, ${source.total_failures} total`} />
        <DetailRow label="Successes" value={source.total_successes} />
      </div>
      {source.last_error ? <ErrorBlock error={source.last_error} /> : null}
      <RawJson value={source} />
    </div>
  );
}

export function RunDetailsContent({ run }: { run: MonitorRunSnapshot }) {
  return (
    <div className="space-y-4 rounded-md border bg-muted/20 p-3">
      <div className="grid gap-2 text-sm md:grid-cols-2">
        <DetailRow label="Status" value={<StatusBadge status={run.status} />} />
        <DetailRow label="Trigger" value={run.trigger} />
        <DetailRow label="Started" value={formatDate(run.started_at)} />
        <DetailRow label="Finished" value={formatDate(run.finished_at)} />
        <DetailRow label="Sources" value={`${run.totals.sources_completed}/${run.totals.sources_total} completed`} />
        <DetailRow label="Failed Sources" value={run.totals.sources_failed} />
        <DetailRow label="Jobs" value={`${run.totals.jobs_collected} collected, ${run.totals.jobs_inserted} new, ${run.totals.jobs_updated} updated`} />
        <DetailRow label="Matched" value={`${run.totals.jobs_matched} matched, ${run.totals.jobs_rejected} rejected`} />
        <DetailRow label="Alerts" value={run.totals.alerts} />
      </div>

      <Section title="Source Breakdown">
        {Object.entries(run.sources).map(([name, source]) => (
          <div key={name} className="rounded-md border p-2 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{name}</span>
              <StatusBadge status={source.status} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {source.collected} collected · {formatDuration(source.duration_ms)}
            </p>
            {source.error ? <p className="mt-1 break-words text-xs text-destructive">{source.error}</p> : null}
          </div>
        ))}
      </Section>

      <Section title="Match Levels">
        <KeyValueList value={run.match_levels} />
      </Section>
      <Section title="Dimensions">
        <KeyValueList value={run.dimensions} />
      </Section>
      {run.errors.length ? <ErrorBlock error={run.errors.map((item) => `${item.source}: ${item.error}`).join("\n")} /> : null}
      <RawJson value={run} />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 break-words font-medium">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase text-muted-foreground">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function KeyValueList({ value }: { value: Record<string, unknown> }) {
  const entries = Object.entries(value);
  if (!entries.length) return <p className="text-sm text-muted-foreground">No data.</p>;
  return (
    <div className="space-y-1 text-sm">
      {entries.map(([key, item]) => (
        <div key={key} className="flex justify-between gap-3 rounded-md border px-2 py-1">
          <span className="break-words text-muted-foreground">{key}</span>
          <span className="text-right font-medium">{typeof item === "object" ? JSON.stringify(item) : String(item)}</span>
        </div>
      ))}
    </div>
  );
}

function ErrorBlock({ error }: { error: string }) {
  return <pre className="whitespace-pre-wrap rounded-md border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive">{error}</pre>;
}

function RawJson({ value }: { value: unknown }) {
  return (
    <details className="rounded-md border p-2 text-xs">
      <summary className="cursor-pointer text-muted-foreground">Raw snapshot</summary>
      <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap break-words">{JSON.stringify(value, null, 2)}</pre>
    </details>
  );
}

function StatusBadge({ status }: { status: string }) {
  return <Badge variant={status === "failed" ? "destructive" : status === "running" ? "default" : "outline"}>{status}</Badge>;
}

function formatDate(value: string | null | undefined) {
  return value ? new Date(value).toLocaleString() : "N/A";
}

function formatDuration(value: number | null | undefined) {
  return typeof value === "number" ? `${Math.round(value)} ms` : "N/A";
}
