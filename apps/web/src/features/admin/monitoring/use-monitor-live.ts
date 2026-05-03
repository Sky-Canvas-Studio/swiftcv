import { useCallback, useEffect, useRef, useState } from "react";
import { client } from "@/lib/client";
import { monitorServerMessageSchema } from "./schemas";
import type {
  MonitorOverviewResponse,
  MonitorRunSnapshot,
  MonitorSourceSnapshot,
} from "./types";

type ConnectionState = "connecting" | "connected" | "disconnected" | "error";
type MonitorSocket = ReturnType<typeof client.admin.monitoring.ws.subscribe>;

const SNAPSHOT_MESSAGES = [
  { type: "get_snapshot", query: "overview" },
  { type: "get_snapshot", query: "sources" },
  { type: "get_snapshot", query: "runs", limit: 20 },
] as const;

export function useMonitorLive() {
  const wsRef = useRef<MonitorSocket | null>(null);
  const snapshotTimerRef = useRef<number | null>(null);
  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [overview, setOverview] = useState<MonitorOverviewResponse | null>(null);
  const [sources, setSources] = useState<MonitorSourceSnapshot[]>([]);
  const [runs, setRuns] = useState<MonitorRunSnapshot[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);

  const requestSnapshots = useCallback((ws = wsRef.current) => {
    for (const message of SNAPSHOT_MESSAGES) {
      ws?.send(message);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    function clearSnapshotTimer() {
      if (snapshotTimerRef.current !== null) {
        window.clearTimeout(snapshotTimerRef.current);
        snapshotTimerRef.current = null;
      }
    }

    function scheduleSnapshotRequest() {
      if (isCancelled || snapshotTimerRef.current !== null) {
        return;
      }

      snapshotTimerRef.current = window.setTimeout(() => {
        snapshotTimerRef.current = null;
        requestSnapshots();
      }, 500);
    }

    setConnection("connecting");
    const ws = client.admin.monitoring.ws.subscribe();
    wsRef.current = ws;

    ws.on("open", () => {
      if (isCancelled) return;
      setConnection("connected");
      setLastError(null);
      ws.send({ type: "subscribe", channels: ["overview", "runs", "sources"] });
      requestSnapshots(ws);
    });

    ws.subscribe((event) => {
      const payload = monitorServerMessageSchema.safeParse(event.data);
      if (!payload.success) {
        setLastError(`Monitor message parse failed: ${payload.error.issues[0]?.message ?? "unknown payload"}`);
        return;
      }

      if (payload.data.type === "snapshot") {
        setLastError(null);
        if (payload.data.query === "overview" && "data" in payload.data) {
          setOverview(payload.data.data);
          setSources(payload.data.data.sources);
        }
        if (payload.data.query === "sources" && "data" in payload.data) {
          setSources(payload.data.data);
        }
        if (payload.data.query === "runs" && "data" in payload.data) {
          setRuns(payload.data.data);
        }
        return;
      }

      if (payload.data.type === "event") {
        scheduleSnapshotRequest();
        return;
      }

      if (payload.data.type === "error") {
        setLastError(payload.data.message);
      }
    });

    ws.on("error", () => {
      if (isCancelled) return;
      setConnection("error");
    });

    ws.on("close", () => {
      if (isCancelled) return;
      setConnection("disconnected");
    });

    return () => {
      isCancelled = true;
      clearSnapshotTimer();
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [requestSnapshots]);

  const forceRefresh = useCallback(() => {
    requestSnapshots();
  }, [requestSnapshots]);

  return {
    connection,
    overview,
    sources,
    runs,
    lastError,
    forceRefresh,
  };
}
