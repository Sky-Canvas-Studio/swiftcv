import { client } from "@/lib/client";
import {
  monitorOverviewSchema,
  monitorRunsSchema,
  monitorSourcesSchema,
} from "./schemas";

export async function fetchMonitorOverview() {
  const { data, error } = await client.admin.monitoring.overview.get();
  if (error) throw new Error("Failed to fetch monitor overview");
  return monitorOverviewSchema.parse(data);
}

export async function fetchMonitorSources() {
  const { data, error } = await client.admin.monitoring.sources.get();
  if (error) throw new Error("Failed to fetch monitor sources");
  return monitorSourcesSchema.parse(data);
}

export async function fetchMonitorRuns(limit = 20) {
  const { data, error } = await client.admin.monitoring.runs.get({
    query: { limit },
  });
  if (error) throw new Error("Failed to fetch monitor runs");
  return monitorRunsSchema.parse(data);
}
