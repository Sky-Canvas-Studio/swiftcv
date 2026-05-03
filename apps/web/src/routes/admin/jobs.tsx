import { createFileRoute } from "@tanstack/react-router";
import { AdminJobsPage } from "@/features/admin/jobs/jobs-page";

export const Route = createFileRoute("/admin/jobs")({
  component: AdminJobsPage,
});
