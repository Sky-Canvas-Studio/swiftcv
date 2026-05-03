import { t } from "elysia";

export const MonitorRunsQueryDto = t.Object({
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 20 })),
});

export type MonitorRunsQuery = typeof MonitorRunsQueryDto.static;
