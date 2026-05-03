import { env } from "@env/server";
import type { JobsListQuery } from "./jobs.dto";

function buildJoblakeJobsUrl(query: JobsListQuery) {
  const url = new URL("/jobs", env.JOBLAKE_HTTP_URL);
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    url.searchParams.set(key, String(value));
  }
  return url;
}

export async function proxyJobsHttp(query: JobsListQuery): Promise<Response> {
  const upstreamResponse = await fetch(buildJoblakeJobsUrl(query), {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });

  const body = await upstreamResponse.text();
  const contentType = upstreamResponse.headers.get("content-type");

  return new Response(body, {
    status: upstreamResponse.status,
    headers: contentType ? { "content-type": contentType } : undefined,
  });
}
