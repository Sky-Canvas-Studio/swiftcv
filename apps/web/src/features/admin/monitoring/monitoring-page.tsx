import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMonitorLive } from "./use-monitor-live";
import type { MonitorRunSnapshot, MonitorSourceSnapshot } from "./types";

export function AdminMonitoringPage() {
  const { connection, overview, sources, runs, lastError, forceRefresh } = useMonitorLive();

  const isRefreshing = connection === "connecting";

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
          <CardTitle className="text-base">Current Run Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Run ID" value={overview?.current_run?.run_id ?? "No active run"} />
          <Metric label="Jobs Seen" value={String(overview?.current_run?.totals.jobs_seen ?? 0)} />
          <Metric label="Jobs Matched" value={String(overview?.current_run?.totals.jobs_matched ?? 0)} />
          <Metric label="Jobs Upserted" value={String(overview?.current_run?.totals.jobs_upserted ?? 0)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sources.length ? (
            sources.map((source) => <SourceRow key={source.source} source={source} />)
          ) : (
            <p className="text-sm text-muted-foreground">No source snapshots yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Runs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {runs.length ? (
            runs.slice(0, 10).map((run) => <RunRow key={run.run_id} run={run} />)
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

function SourceRow({ source }: { source: MonitorSourceSnapshot }) {
  return (
    <div className="grid gap-2 rounded-md border p-3 md:grid-cols-[1fr_auto_auto] md:items-center">
      <div>
        <p className="font-medium">{source.source}</p>
        <p className="text-xs text-muted-foreground">Last run: {source.last_run_id ?? "N/A"}</p>
      </div>
      <Badge variant={source.status === "failed" ? "destructive" : "outline"}>{source.status}</Badge>
      <p className="text-xs text-muted-foreground">Collected: {source.last_collected}</p>
    </div>
  );
}

function RunRow({ run }: { run: MonitorRunSnapshot }) {
  return (
    <div className="grid gap-2 rounded-md border p-3 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <p className="font-medium break-all">{run.run_id}</p>
        <p className="text-xs text-muted-foreground">
          Trigger: {run.trigger} · Sources: {run.sources_expected.length}
        </p>
      </div>
      <Badge variant={run.status === "running" ? "default" : "secondary"}>{run.status}</Badge>
    </div>
  );
}
