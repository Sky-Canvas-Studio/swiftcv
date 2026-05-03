import { Elysia } from "elysia";
import { rolesGuard } from "@/guards/roles.guard";
import { JobsListQueryDto } from "./jobs.dto";
import { proxyJobsHttp } from "./jobs.service";

export const adminJobsController = new Elysia({
  prefix: "/admin/jobs",
  detail: {
    tags: ["Admin - Jobs"],
  },
}).guard(
  {
    beforeHandle: rolesGuard(["ADMIN", "OWNER"]),
  },
  (app) =>
    app.get(
      "/",
      ({ query }) => {
        return proxyJobsHttp(query);
      },
      {
        query: JobsListQueryDto,
        detail: {
          summary: "Proxy paginated Joblake jobs",
        },
      },
    ),
);
