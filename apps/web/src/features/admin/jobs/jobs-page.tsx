import { useQuery } from "@tanstack/react-query";
import { BriefcaseBusiness } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { queryKeys } from "@/constants/query-keys";
import { useObject } from "@/hooks/use-object";
import { fetchAdminJobs } from "./api";
import { JobsFiltersCard } from "./jobs-filters";
import { JobsList } from "./jobs-list";
import type { JobsFilters } from "./types";

const DEFAULT_FILTERS: JobsFilters = {
  page: 1,
  perPage: 20,
  q: "",
  title: "",
  titleMatch: "contains",
  semantic: false,
  source: "",
  skills: "",
  skillMatch: "any",
  isRemote: "all",
  salaryPresent: "all",
  country: "",
  minScore: "",
  maxScore: "",
  publishedFrom: "",
  postedWithinHours: "",
  sort: "published_at_desc",
};

export function AdminJobsPage() {
  const { object: filters, setObjectValue, setObject } = useObject(DEFAULT_FILTERS);
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: queryKeys.admin.jobs.list(filters),
    queryFn: () => fetchAdminJobs(filters),
  });

  const updateFilter = <K extends keyof JobsFilters>(key: K, value: JobsFilters[K]) => {
    setObjectValue(key, value);
    if (key !== "page") {
      setObjectValue("page", 1);
    }
  };

  return (
    <div className="w-full min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Jobs</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Browse every Joblake job with search, skills, score, and date filters.
          </p>
        </div>
        <Badge variant="secondary">{data?.meta.total ?? 0} jobs</Badge>
      </div>

      <Metrics data={data} loading={isLoading} />

      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load jobs"}
        </div>
      ) : null}

      <JobsFiltersCard
        filters={filters}
        refreshing={isFetching}
        onChange={updateFilter}
        onRefresh={() => void refetch()}
        onReset={() => setObject(DEFAULT_FILTERS)}
      />

      <JobsList
        data={data}
        loading={isLoading}
        page={filters.page}
        onPageChange={(page) => updateFilter("page", page)}
      />
    </div>
  );
}

function Metrics(props: { data: Awaited<ReturnType<typeof fetchAdminJobs>> | undefined; loading: boolean }) {
  const items = props.data?.items ?? [];
  const remote = items.filter((job) => job.is_remote).length;
  const scored = items.filter((job) => typeof job.match.score === "number").length;
  const semantic = items.filter((job) => typeof job.semantic_similarity === "number").length;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Metric label="Visible" value={props.loading ? "..." : String(items.length)} />
      <Metric label="Remote" value={String(remote)} />
      <Metric label="Scored" value={String(scored || semantic)} />
    </div>
  );
}

function Metric(props: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{props.label}</p>
        <p className="mt-1 text-2xl font-semibold">{props.value}</p>
      </CardContent>
    </Card>
  );
}
