import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { JobListItem, JobsListResponse } from "./types";

export function JobsList(props: {
  data: JobsListResponse | undefined;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
}) {
  const meta = props.data?.meta;

  return (
    <Card>
      <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <CardTitle className="text-base">Jobs</CardTitle>
          <p className="text-sm text-muted-foreground">
            {meta ? `${meta.total} jobs matched` : "Loading jobs"}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Page {meta?.page ?? props.page} of {meta?.total_pages || 1}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <DesktopJobsTable data={props.data} loading={props.loading} />
        <MobileJobsList data={props.data} loading={props.loading} />
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" disabled={!meta?.has_prev} onClick={() => props.onPageChange(Math.max(1, props.page - 1))}>
            Previous
          </Button>
          <Button variant="outline" disabled={!meta?.has_next} onClick={() => props.onPageChange(props.page + 1)}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DesktopJobsTable(props: { data: JobsListResponse | undefined; loading: boolean }) {
  return (
    <div className="hidden rounded-md border lg:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Stack</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Published</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.loading ? (
            <EmptyRow text="Loading jobs..." />
          ) : (props.data?.items.length ?? 0) === 0 ? (
            <EmptyRow text="No jobs found for these filters." />
          ) : (
            props.data?.items.map((job) => (
              <TableRow key={job.fingerprint ?? job.source_job_id}>
                <TableCell className="max-w-[420px] whitespace-normal">
                  <JobTitle job={job} />
                </TableCell>
                <TableCell>
                  <SourceBadges job={job} />
                </TableCell>
                <TableCell className="max-w-[260px] whitespace-normal">
                  <StackBadges job={job} />
                </TableCell>
                <TableCell>
                  <ScoreBadge job={job} />
                </TableCell>
                <TableCell>{formatDate(job.published_at ?? job.extracted_at)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function MobileJobsList(props: { data: JobsListResponse | undefined; loading: boolean }) {
  if (props.loading) return <div className="rounded-md border p-4 text-center text-sm">Loading jobs...</div>;
  if ((props.data?.items.length ?? 0) === 0) return <div className="rounded-md border p-4 text-center text-sm">No jobs found for these filters.</div>;

  return (
    <div className="grid gap-3 lg:hidden">
      {props.data?.items.map((job) => (
        <div key={job.fingerprint ?? job.source_job_id} className="rounded-md border p-4">
          <JobTitle job={job} />
          <div className="mt-3 flex flex-wrap gap-2">
            <SourceBadges job={job} />
            <ScoreBadge job={job} />
          </div>
          <div className="mt-3"><StackBadges job={job} /></div>
          <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{job.description_preview}</p>
        </div>
      ))}
    </div>
  );
}

function JobTitle({ job }: { job: JobListItem }) {
  return (
    <div className="min-w-0">
      <div className="flex min-w-0 items-start gap-2">
        <p className="font-medium leading-snug">{job.job_title ?? "Untitled job"}</p>
        {job.source_url ? (
          <a href={job.source_url} target="_blank" rel="noreferrer" className="mt-0.5 text-muted-foreground hover:text-foreground">
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{job.company ?? "Unknown company"} · {job.location ?? "Unknown location"}</p>
    </div>
  );
}

function SourceBadges({ job }: { job: JobListItem }) {
  return (
    <div className="flex flex-wrap gap-1">
      {job.source ? <Badge variant="outline">{job.source}</Badge> : null}
      {job.is_remote ? <Badge variant="secondary">Remote</Badge> : null}
      {job.publisher ? <Badge variant="outline">{job.publisher}</Badge> : null}
    </div>
  );
}

function StackBadges({ job }: { job: JobListItem }) {
  const stack = job.tech_stack.slice(0, 5);
  if (!stack.length) return <span className="text-xs text-muted-foreground">No stack detected</span>;
  return <div className="flex flex-wrap gap-1">{stack.map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}</div>;
}

function ScoreBadge({ job }: { job: JobListItem }) {
  const score = typeof job.match.score === "number" ? job.match.score : null;
  return <Badge variant={score && score >= 75 ? "default" : "outline"}>{score ?? "N/A"}</Badge>;
}

function EmptyRow({ text }: { text: string }) {
  return <TableRow><TableCell colSpan={5} className="h-24 text-center">{text}</TableCell></TableRow>;
}

function formatDate(value: string | null | undefined) {
  return value ? new Date(value).toLocaleDateString() : "N/A";
}
