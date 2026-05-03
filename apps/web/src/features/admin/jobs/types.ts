export type JobsTitleMatch = "contains" | "all_words" | "phrase" | "semantic";
export type JobsSkillMatch = "any" | "all";
export type JobsSort =
  | "published_at_desc"
  | "extracted_at_desc"
  | "score_desc"
  | "semantic_desc"
  | "title_asc";

export type JobsFilters = {
  page: number;
  perPage: number;
  q: string;
  title: string;
  titleMatch: JobsTitleMatch;
  semantic: boolean;
  source: string;
  skills: string;
  skillMatch: JobsSkillMatch;
  isRemote: "all" | "true" | "false";
  salaryPresent: "all" | "true" | "false";
  country: string;
  minScore: string;
  publishedFrom: string;
  postedWithinHours: string;
  sort: JobsSort;
};

export type JobListItem = {
  source: string | null;
  source_job_id: string | null;
  fingerprint: string | null;
  job_title: string | null;
  company: string | null;
  location: string | null;
  source_url: string | null;
  published_at: string | null;
  published_at_label: string | null;
  extracted_at: string | null;
  is_remote: boolean;
  employment_type: string | null;
  category: string | null;
  publisher: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  tech_stack: string[];
  salary_range: { raw?: string | null; min?: number | null; max?: number | null };
  signals: Record<string, unknown>;
  match: { score?: number | null; level?: string | null; rejected?: boolean | null };
  semantic_similarity: number | null;
  description_preview: string;
};

export type JobsListResponse = {
  items: JobListItem[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
    sort: JobsSort | string;
    filters: Record<string, unknown>;
  };
};
