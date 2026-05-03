import { RefreshCw } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RunDetailsContent, SourceDetailsContent } from "./monitoring-detail-panel";
import { useMonitorLive } from "./use-monitor-live";
import type { MonitorRunSnapshot, MonitorSourceSnapshot } from "./types";

export function AdminMonitoringPage() {
  const { connection, overview, sources, runs, lastError, forceRefresh } = useMonitorLive();

  const isRefreshing = connection === "connecting";
  const overviewRun = overview?.current_run ?? runs[0] ?? null;
  const overviewMode = overview?.current_run ? "active" : overviewRun ? "latest" : "empty";

  return (
    <div className="w-full min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Monitoring</h1>
          <p className="text-sm text-muted-foreground">
            Live Joblake ingestion status from websocket and snapshot sync.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={connection === "connected" ? "secondary" : "default"}>
            {connection}
          </Badge>
          <Button
            variant="outline"
            className="gap-2"
            disabled={isRefreshing}
            onClick={() => void forceRefresh()}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {lastError ? <p className="text-sm text-destructive">{lastError}</p> : null}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">Run Overview</CardTitle>
            {overviewMode !== "empty" ? <Badge variant={overviewMode === "active" ? "default" : "outline"}>{overviewMode}</Badge> : null}
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Run ID" value={shortId(overviewRun?.run_id) ?? "No runs yet"} />
          <Metric label="Jobs" value={`${overviewRun?.totals.jobs_collected ?? 0} collected / ${overviewRun?.totals.jobs_inserted ?? 0} new`} />
          <Metric label="Pipeline" value={`${overviewRun?.totals.jobs_matched ?? 0} matched / ${overviewRun?.totals.jobs_upserted ?? 0} upserted`} />
          <Metric label="Sources" value={`${overviewRun?.totals.sources_completed ?? 0} completed / ${overviewRun?.totals.sources_failed ?? 0} failed`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sources</CardTitle>
        </CardHeader>
        <CardContent>
          {sources.length ? (
            <Accordion className="space-y-2">
              {sources.map((source) => (
                <SourceItem key={source.source} source={source} />
              ))}
            </Accordion>
          ) : (
            <p className="text-sm text-muted-foreground">No source snapshots yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Runs</CardTitle>
        </CardHeader>
        <CardContent>
          {runs.length ? (
            <Accordion className="space-y-2">
              {runs.slice(0, 10).map((run) => (
                <RunItem key={run.run_id} run={run} />
              ))}
            </Accordion>
          ) : (
            <p className="text-sm text-muted-foreground">No runs available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium break-all">{value}</p>
    </div>
  );
}

function SourceItem({ source }: { source: MonitorSourceSnapshot }) {
  return (
    <AccordionItem value={`source:${source.source}`} className="rounded-md border px-3">
      <AccordionTrigger className="py-3 text-sm no-underline hover:no-underline">
        <div className="grid w-full gap-2 pr-3 text-left md:grid-cols-[1fr_auto_auto] md:items-center">
          <div>
            <p className="font-medium">{source.source}</p>
            <p className="text-xs text-muted-foreground">Last scrape: {formatDate(source.last_finished_at)}</p>
          </div>
          <Badge variant={source.status === "failed" ? "destructive" : "outline"}>{source.status}</Badge>
          <p className="text-xs text-muted-foreground">
            {source.last_collected} collected · {source.consecutive_failures} failures
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <SourceDetailsContent source={source} />
      </AccordionContent>
    </AccordionItem>
  );
}

function RunItem({ run }: { run: MonitorRunSnapshot }) {
  return (
    <AccordionItem value={`run:${run.run_id}`} className="rounded-md border px-3">
      <AccordionTrigger className="py-3 text-sm no-underline hover:no-underline">
        <div className="grid w-full gap-2 pr-3 text-left md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="font-medium break-all">{shortId(run.run_id)}</p>
            <p className="text-xs text-muted-foreground">
              {run.trigger} · {formatDate(run.started_at)} · {run.totals.jobs_inserted} new / {run.totals.jobs_updated} updated
            </p>
            {run.errors.length ? <p className="mt-1 text-xs text-destructive">{run.errors.length} source error(s)</p> : null}
          </div>
          <Badge variant={run.status === "running" ? "default" : "secondary"}>{run.status}</Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <RunDetailsContent run={run} />
      </AccordionContent>
    </AccordionItem>
  );
}

function shortId(value: string | undefined) {
  if (!value) return undefined;
  return value.length > 22 ? `${value.slice(0, 14)}...${value.slice(-6)}` : value;
}

function formatDate(value: string | null | undefined) {
  return value ? new Date(value).toLocaleString() : "N/A";
}
