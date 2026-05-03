import { env } from "@env/server";

type ProxyPath = "/overview" | "/sources" | "/runs";

const MONITOR_BASE_PATH = "/monitor";

function buildMonitorUrl(path: ProxyPath, query?: URLSearchParams) {
  const url = new URL(`${MONITOR_BASE_PATH}${path}`, env.JOBLAKE_HTTP_URL);
  if (query) {
    url.search = query.toString();
  }
  return url;
}

export async function proxyMonitorHttp(
  path: ProxyPath,
  query?: URLSearchParams,
): Promise<Response> {
  const upstreamResponse = await fetch(buildMonitorUrl(path, query), {
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
