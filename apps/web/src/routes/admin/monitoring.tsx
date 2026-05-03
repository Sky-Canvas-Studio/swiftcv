import { createFileRoute } from "@tanstack/react-router";
import { AdminMonitoringPage } from "@/features/admin/monitoring/monitoring-page";

export const Route = createFileRoute("/admin/monitoring")({
  component: AdminMonitoringPage,
});
