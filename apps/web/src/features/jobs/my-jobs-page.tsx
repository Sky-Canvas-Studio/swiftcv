import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Ban,
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  LayoutGrid,
  List,
  MapPin,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryKeys } from "@/constants/query-keys";
import { JobsFiltersCard } from "@/features/admin/jobs/jobs-filters";
import type { JobDetail, JobListItem, JobsFilters } from "@/features/admin/jobs/types";
import { useObject } from "@/hooks/use-object";
import {
  fetchMyJobDetail,
  fetchMyJobs,
  recordMyJobAction,
  type JobsViewMode,
  type MyJobsFilters,
  type MyJobsTab,
} from "./my-jobs-api";

const DEFAULT_FILTERS: MyJobsFilters = {
  tab: "all",
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
  sort: "score_desc",
};

export function MyJobsPage() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<JobsViewMode>("grid");
  const [detailJob, setDetailJob] = useState<JobListItem | null>(null);
  const { object: filters, setObjectValue, setObject } = useObject(DEFAULT_FILTERS);
  const listQuery = useQuery({
    queryKey: queryKeys.jobs.my(filters),
    queryFn: () => fetchMyJobs(filters),
  });
  const actionMutation = useMutation({
    mutationFn: ({ action, job }: { action: "clicked_to_apply" | "dismiss" | "restore"; job: JobListItem }) =>
      recordMyJobAction(action, job),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-jobs"] }),
  });

  const updateFilter = <K extends keyof MyJobsFilters>(key: K, value: MyJobsFilters[K]) => {
    setObjectValue(key, value);
    if (key !== "page") {
      setObjectValue("page", 1);
    }
  };
  const updateJobsFilter = <K extends keyof JobsFilters>(key: K, value: JobsFilters[K]) => {
    updateFilter(key, value as MyJobsFilters[K]);
  };

  const visitJob = async (job: JobListItem) => {
    if (!job.source_url) return;
    await actionMutation.mutateAsync({ action: "clicked_to_apply", job });
    window.open(job.source_url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">My Jobs</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Resume-matched jobs from your SwiftCV profile.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={view === "grid" ? "secondary" : "outline"} size="icon-sm" onClick={() => setView("grid")} title="Grid view">
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={view === "list" ? "secondary" : "outline"} size="icon-sm" onClick={() => setView("list")} title="List view">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {listQuery.error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {listQuery.error instanceof Error ? listQuery.error.message : "Failed to load jobs"}
        </div>
      ) : null}

      <JobsFiltersCard
        filters={filters}
        refreshing={listQuery.isFetching}
        onChange={updateJobsFilter}
        onRefresh={() => void listQuery.refetch()}
        onReset={() => setObject(DEFAULT_FILTERS)}
      />

      <Tabs value={filters.tab} onValueChange={(value) => updateFilter("tab", value as MyJobsTab)} className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="h-auto flex-wrap">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="clicked">Clicked to apply</TabsTrigger>
            <TabsTrigger value="dismissed">Don't want to see</TabsTrigger>
          </TabsList>
          <Badge variant="secondary">{listQuery.data?.meta.total ?? 0} jobs</Badge>
        </div>
        <TabsContent value={filters.tab}>
          <JobsResults
            data={listQuery.data}
            loading={listQuery.isLoading}
            page={filters.page}
            view={view}
            tab={filters.tab}
            onPageChange={(page) => updateFilter("page", page)}
            onDetails={setDetailJob}
            onVisit={visitJob}
            onDismiss={(job) => actionMutation.mutate({ action: "dismiss", job })}
            onRestore={(job) => actionMutation.mutate({ action: "restore", job })}
          />
        </TabsContent>
      </Tabs>

      <JobDetailsDialog job={detailJob} onOpenChange={(open) => !open && setDetailJob(null)} />
    </div>
  );
}

function JobsResults(props: {
  data: Awaited<ReturnType<typeof fetchMyJobs>> | undefined;
  loading: boolean;
  page: number;
  view: JobsViewMode;
  tab: MyJobsTab;
  onPageChange: (page: number) => void;
  onDetails: (job: JobListItem) => void;
  onVisit: (job: JobListItem) => void;
  onDismiss: (job: JobListItem) => void;
  onRestore: (job: JobListItem) => void;
}) {
  const meta = props.data?.meta;
  const items = props.data?.items ?? [];

  return (
    <div className="space-y-4">
      {props.loading ? (
        <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">Loading jobs...</div>
      ) : items.length === 0 ? (
        <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">No jobs found for these filters.</div>
      ) : props.view === "grid" ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {items.map((job) => (
            <JobCard key={job.fingerprint ?? job.source_job_id} job={job} tab={props.tab} {...props} />
          ))}
        </div>
      ) : (
        <JobAccordionList items={items} tab={props.tab} {...props} />
      )}

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" disabled={!meta?.has_prev} onClick={() => props.onPageChange(Math.max(1, props.page - 1))}>
          Previous
        </Button>
        <Button variant="outline" disabled={!meta?.has_next} onClick={() => props.onPageChange(props.page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

function JobCard(props: JobActionsProps) {
  const job = props.job;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-lg leading-snug">{job.job_title ?? "Untitled job"}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{job.company ?? "Unknown company"}</p>
          </div>
          <ScoreBadge job={job} />
        </div>
        <MetaBadges job={job} />
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="line-clamp-3 text-sm text-muted-foreground">{job.description_preview}</p>
        <StackBadges job={job} />
        <JobActionButtons {...props} />
      </CardContent>
    </Card>
  );
}

function JobAccordionList(props: JobCallbacks & { items: JobListItem[]; tab: MyJobsTab }) {
  return (
    <div className="overflow-hidden rounded-md border">
      {props.items.map((job) => (
        <details key={job.fingerprint ?? job.source_job_id} className="group border-b last:border-b-0">
          <summary className="grid cursor-pointer gap-3 px-4 py-3 text-sm hover:bg-muted/40 lg:grid-cols-[minmax(240px,1.5fr)_120px_160px_120px]">
            <div className="min-w-0">
              <p className="truncate font-medium">{job.job_title ?? "Untitled job"}</p>
              <p className="truncate text-xs text-muted-foreground">{job.company ?? "Unknown company"} · {job.location ?? "Unknown location"}</p>
            </div>
            <div><ScoreBadge job={job} /></div>
            <div className="text-xs text-muted-foreground">{formatDate(job.published_at ?? job.extracted_at)}</div>
            <div className="text-xs text-muted-foreground">{job.source ?? "Unknown"}</div>
          </summary>
          <div className="space-y-4 px-4 pb-4">
            <MetaBadges job={job} />
            <StackBadges job={job} />
            <p className="text-sm text-muted-foreground">{job.description_preview}</p>
            <JobActionButtons {...props} job={job} />
          </div>
        </details>
      ))}
    </div>
  );
}

type JobActionsProps = {
  job: JobListItem;
  tab: MyJobsTab;
  onDetails: (job: JobListItem) => void;
  onVisit: (job: JobListItem) => void;
  onDismiss: (job: JobListItem) => void;
  onRestore: (job: JobListItem) => void;
};

type JobCallbacks = Omit<JobActionsProps, "job">;

function JobActionButtons(props: JobActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => props.onDetails(props.job)}>
        Details
      </Button>
      <Button size="sm" disabled={!props.job.source_url} onClick={() => props.onVisit(props.job)}>
        <ExternalLink className="h-4 w-4" />
        Visit job
      </Button>
      {props.tab === "dismissed" ? (
        <Button variant="outline" size="sm" onClick={() => props.onRestore(props.job)}>
          <RotateCcw className="h-4 w-4" />
          Restore
        </Button>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => props.onDismiss(props.job)}>
          <Ban className="h-4 w-4" />
          Don't want to see
        </Button>
      )}
    </div>
  );
}

function JobDetailsDialog(props: { job: JobListItem | null; onOpenChange: (open: boolean) => void }) {
  const detailQuery = useQuery({
    queryKey: queryKeys.jobs.detail({
      fingerprint: props.job?.fingerprint,
      source_job_id: props.job?.source_job_id,
    }),
    queryFn: () => fetchMyJobDetail(props.job as JobListItem),
    enabled: Boolean(props.job),
  });
  const detail = detailQuery.data;

  return (
    <Dialog open={Boolean(props.job)} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg">{props.job?.job_title ?? "Job details"}</DialogTitle>
          <DialogDescription>
            {props.job?.company ?? "Unknown company"} · {props.job?.location ?? "Unknown location"}
          </DialogDescription>
        </DialogHeader>
        {detailQuery.isLoading ? (
          <div className="rounded-md border p-6 text-sm text-muted-foreground">Loading details...</div>
        ) : detail ? (
          <JobDetailContent detail={detail} />
        ) : (
          <div className="rounded-md border p-6 text-sm text-muted-foreground">No details available.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function JobDetailContent({ detail }: { detail: JobDetail }) {
  const reasons = asStringArray(detail.match?.reasons);
  const warnings = asStringArray(detail.match?.warnings);
  const applyOptions = detail.apply_options ?? [];
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <ScoreBadge job={detail} />
        <MetaBadges job={detail} />
      </div>
      <StackBadges job={detail} />
      <DetailSection title="Match reasons" items={reasons} empty="No match reasons available." />
      <DetailSection title="Warnings" items={warnings} empty="No warnings available." />
      <Separator />
      <div className="grid gap-3 text-sm sm:grid-cols-2">
        <DetailRow label="Employment" value={detail.employment_type || detail.employment_types?.join(", ")} />
        <DetailRow label="Salary" value={formatSalary(detail.salary_range)} />
        <DetailRow label="Source" value={detail.source || detail.publisher} />
        <DetailRow label="Published" value={formatDate(detail.published_at ?? detail.extracted_at)} />
      </div>
      {applyOptions.length ? (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Apply options</h3>
          <div className="flex flex-wrap gap-2">
            {applyOptions.map((option, index) => (
              <a key={`${option.apply_link}-${index}`} href={option.apply_link ?? "#"} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" />
                  {option.publisher || (option.is_direct ? "Direct apply" : "Apply")}
                </Button>
              </a>
            ))}
          </div>
        </div>
      ) : null}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Description</h3>
        <p className="whitespace-pre-line text-sm text-muted-foreground">
          {detail.description_text || detail.description_raw || detail.description_preview}
        </p>
      </div>
    </div>
  );
}

function DetailSection(props: { title: string; items: string[]; empty: string }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{props.title}</h3>
      {props.items.length ? (
        <ul className="space-y-1 text-sm text-muted-foreground">
          {props.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">{props.empty}</p>
      )}
    </div>
  );
}

function DetailRow(props: { label: string; value: string | null | undefined }) {
  return (
    <div className="rounded-md border p-3">
      <p className="text-xs text-muted-foreground">{props.label}</p>
      <p className="mt-1 font-medium">{props.value || "N/A"}</p>
    </div>
  );
}

function MetaBadges({ job }: { job: JobListItem }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {job.location ? <Badge variant="outline"><MapPin className="h-3 w-3" />{job.location}</Badge> : null}
      {job.is_remote ? <Badge variant="secondary">Remote</Badge> : null}
      {job.source ? <Badge variant="outline">{job.source}</Badge> : null}
      {job.published_at || job.extracted_at ? <Badge variant="outline"><CalendarDays className="h-3 w-3" />{formatDate(job.published_at ?? job.extracted_at)}</Badge> : null}
      {formatSalary(job.salary_range) !== "N/A" ? <Badge variant="secondary">{formatSalary(job.salary_range)}</Badge> : null}
    </div>
  );
}

function StackBadges({ job }: { job: JobListItem }) {
  const stack = job.tech_stack.slice(0, 8);
  if (!stack.length) return <p className="text-xs text-muted-foreground">No stack detected</p>;
  return <div className="flex flex-wrap gap-1">{stack.map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}</div>;
}

function ScoreBadge({ job }: { job: JobListItem }) {
  const score = typeof job.match.score === "number" ? job.match.score : null;
  return <Badge variant={score && score >= 75 ? "default" : "outline"}>{score ?? "N/A"}</Badge>;
}

function formatDate(value: string | null | undefined) {
  return value ? new Date(value).toLocaleDateString() : "N/A";
}

function formatSalary(value: JobListItem["salary_range"]) {
  if (!value) return "N/A";
  if (value.raw) return String(value.raw);
  if (value.min || value.max) return [value.min, value.max].filter(Boolean).join(" - ");
  return "N/A";
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.map(String) : [];
}
