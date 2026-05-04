import { Elysia } from "elysia";
import { authGuard } from "@/guards/auth.guard";
import { MyJobActionDto, MyJobDetailQueryDto, MyJobsQueryDto } from "./jobs.dto";
import { jobsService } from "./jobs.service";

export const jobsController = new Elysia({
  prefix: "/jobs",
  detail: { tags: ["Jobs"] },
})
  .use(authGuard)
  .get(
    "/my",
    async ({ query, user, userId, set }) => {
      if (!userId || !user) {
        set.status = 401;
        return { message: "Unauthorized", status: 401 };
      }

      return jobsService.listMyJobs(
        { id: userId, name: user.name, email: user.email },
        query,
      );
    },
    {
      query: MyJobsQueryDto,
      detail: { summary: "List current user's matched jobs" },
    },
  )
  .post(
    "/my/actions",
    async ({ body, userId, set }) => {
      if (!userId) {
        set.status = 401;
        return { message: "Unauthorized", status: 401 };
      }

      try {
        const interaction = await jobsService.recordAction(userId, body);
        return { success: true, interaction };
      } catch (error) {
        set.status = 400;
        return {
          message: error instanceof Error ? error.message : "Unable to update job action",
          status: 400,
        };
      }
    },
    {
      body: MyJobActionDto,
      detail: { summary: "Record current user's job action" },
    },
  )
  .get(
    "/my/detail",
    async ({ query, userId, set }) => {
      if (!userId) {
        set.status = 401;
        return { message: "Unauthorized", status: 401 };
      }
      if (!query.fingerprint && !query.source_job_id) {
        set.status = 400;
        return { message: "fingerprint or source_job_id is required", status: 400 };
      }

      return jobsService.getMyJobDetail(query);
    },
    {
      query: MyJobDetailQueryDto,
      detail: { summary: "Get full detail for a matched job" },
    },
  );
