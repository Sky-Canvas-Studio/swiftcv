import { Elysia } from "elysia";
import { rolesGuard } from "@/guards/roles.guard";
import { env } from "@env/server";
import { MonitorRunsQueryDto } from "./monitoring.dto";
import { proxyMonitorHttp } from "./monitoring.service";

type ProxySocketData = {
  upstreamSocket?: WebSocket;
  pendingMessages?: string[];
};

function forwardJson(ws: { send: (data: unknown) => unknown }, payload: string) {
  try {
    ws.send(JSON.parse(payload));
    return;
  } catch {
    ws.send(payload);
  }
}

function toOutboundPayloads(message: unknown): string[] {
  if (typeof message === "string") {
    return [message];
  }

  if (Array.isArray(message)) {
    return message.map((item) => JSON.stringify(item));
  }

  return [JSON.stringify(message)];
}

export const adminMonitoringController = new Elysia({
  prefix: "/admin/monitoring",
  detail: {
    tags: ["Admin - Monitoring"],
  },
}).guard(
  {
    beforeHandle: rolesGuard(["ADMIN", "OWNER"]),
  },
  (app) =>
    app
      .get("/overview", () => proxyMonitorHttp("/overview"), {
        detail: {
          summary: "Get monitor overview snapshot",
        },
      })
      .get("/sources", () => proxyMonitorHttp("/sources"), {
        detail: {
          summary: "Get monitor source snapshots",
        },
      })
      .get(
        "/runs",
        ({ query }) => {
          const params = new URLSearchParams();
          if (query.limit) {
            params.set("limit", String(query.limit));
          }
          return proxyMonitorHttp("/runs", params);
        },
        {
          query: MonitorRunsQueryDto,
          detail: {
            summary: "Get monitor run snapshots",
          },
        },
      )
      .ws("/ws", {
        open(ws) {
          const proxyData = ws.data as ProxySocketData;
          proxyData.pendingMessages = [];
          const upstreamSocket = new WebSocket(env.JOBLAKE_WS_URL);

          upstreamSocket.onopen = () => {
            const pendingMessages = proxyData.pendingMessages ?? [];
            proxyData.pendingMessages = [];
            for (const pendingMessage of pendingMessages) {
              upstreamSocket.send(pendingMessage);
            }
          };

          upstreamSocket.onmessage = (event) => {
            if (typeof event.data === "string") {
              forwardJson(ws, event.data);
            }
          };

          upstreamSocket.onerror = () => {
            ws.close();
          };

          upstreamSocket.onclose = () => {
            ws.close();
          };

          proxyData.upstreamSocket = upstreamSocket;
        },
        message(ws, message) {
          const proxyData = ws.data as ProxySocketData;
          const upstreamSocket = proxyData.upstreamSocket;
          const payloads = toOutboundPayloads(message);

          if (!upstreamSocket) {
            return;
          }

          if (upstreamSocket.readyState === WebSocket.OPEN) {
            for (const payload of payloads) {
              upstreamSocket.send(payload);
            }
            return;
          }

          if (upstreamSocket.readyState === WebSocket.CONNECTING) {
            proxyData.pendingMessages = [...(proxyData.pendingMessages ?? []), ...payloads];
          }
        },
        close(ws) {
          const proxyData = ws.data as ProxySocketData;
          const upstreamSocket = proxyData.upstreamSocket;
          if (
            upstreamSocket &&
            (upstreamSocket.readyState === WebSocket.OPEN ||
              upstreamSocket.readyState === WebSocket.CONNECTING)
          ) {
            upstreamSocket.close();
          }
          proxyData.upstreamSocket = undefined;
          proxyData.pendingMessages = undefined;
        },
      }),
);
