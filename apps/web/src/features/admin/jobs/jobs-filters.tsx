import { RefreshCw, RotateCcw } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JobsFilters, JobsSkillMatch, JobsSort, JobsTitleMatch } from "./types";

type Props = {
  filters: JobsFilters;
  refreshing: boolean;
  onChange: <K extends keyof JobsFilters>(key: K, value: JobsFilters[K]) => void;
  onReset: () => void;
  onRefresh: () => void;
};

export function JobsFiltersCard(props: Props) {
  const set = props.onChange;

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-base">Filters</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={props.onReset}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={props.onRefresh}>
            <RefreshCw className={props.refreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Field label="Search">
          <Input value={props.filters.q} onChange={(e) => set("q", e.target.value)} placeholder="Company, stack, location" />
        </Field>
        <Field label="Title">
          <Input value={props.filters.title} onChange={(e) => set("title", e.target.value)} placeholder="Senior React" />
        </Field>
        <SelectField label="Title match" value={props.filters.titleMatch} onChange={(value) => set("titleMatch", value as JobsTitleMatch)}>
          <SelectItem value="contains">Contains</SelectItem>
          <SelectItem value="all_words">All words</SelectItem>
          <SelectItem value="phrase">Phrase</SelectItem>
          <SelectItem value="semantic">Semantic</SelectItem>
        </SelectField>
        <Field label="Skills">
          <Input value={props.filters.skills} onChange={(e) => set("skills", e.target.value)} placeholder="typescript,react" />
        </Field>
        <SelectField label="Skill match" value={props.filters.skillMatch} onChange={(value) => set("skillMatch", value as JobsSkillMatch)}>
          <SelectItem value="any">Any skill</SelectItem>
          <SelectItem value="all">All skills</SelectItem>
        </SelectField>
        <SelectField label="Remote" value={props.filters.isRemote} onChange={(value) => set("isRemote", value as JobsFilters["isRemote"])}>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="true">Remote</SelectItem>
          <SelectItem value="false">Non-remote</SelectItem>
        </SelectField>
        <Field label="Source">
          <Input value={props.filters.source} onChange={(e) => set("source", e.target.value)} placeholder="remoteok" />
        </Field>
        <Field label="Country">
          <Input value={props.filters.country} onChange={(e) => set("country", e.target.value)} placeholder="US" />
        </Field>
        <Field label="Min score">
          <Input type="number" min={0} max={100} value={props.filters.minScore} onChange={(e) => set("minScore", e.target.value)} />
        </Field>
        <Field label="Published from">
          <Input type="date" value={props.filters.publishedFrom} onChange={(e) => set("publishedFrom", e.target.value)} />
        </Field>
        <Field label="Posted within hours">
          <Input type="number" min={1} value={props.filters.postedWithinHours} onChange={(e) => set("postedWithinHours", e.target.value)} />
        </Field>
        <SelectField label="Sort" value={props.filters.sort} onChange={(value) => set("sort", value as JobsSort)}>
          <SelectItem value="published_at_desc">Published newest</SelectItem>
          <SelectItem value="extracted_at_desc">Collected newest</SelectItem>
          <SelectItem value="score_desc">Score highest</SelectItem>
          <SelectItem value="semantic_desc">Semantic highest</SelectItem>
          <SelectItem value="title_asc">Title A-Z</SelectItem>
        </SelectField>
      </CardContent>
    </Card>
  );
}

function Field(props: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1 text-sm">{props.label}{props.children}</label>;
}

function SelectField(props: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <Field label={props.label}>
      <Select value={props.value} onValueChange={props.onChange}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>{props.children}</SelectContent>
      </Select>
    </Field>
  );
}
