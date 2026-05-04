import { createFileRoute } from "@tanstack/react-router";
import { MyJobsPage } from "@/features/jobs/my-jobs-page";

export const Route = createFileRoute("/_protected/my-jobs")({
  component: MyJobsPage,
});
