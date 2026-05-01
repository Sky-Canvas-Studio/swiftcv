# SwiftCV Apps

SwiftCV helps users turn their resume data into better job outcomes.

Users provide resume/profile information, and SwiftCV:

- searches jobs automatically
- matches jobs against user profile signals
- recommends best-fit jobs with matching scores
- generates AI interview questions based on role/profile fit
- creates job-specific custom resumes

## Purpose Of This `apps` Workspace

This `apps` folder contains the core product applications:

- `web`: the user-facing frontend where users manage profile/resume, view job matches, and get AI outputs
- `server`: the backend API and business logic that powers auth, profile handling, scoring orchestration, recommendations, and AI workflows

`joblake` is a separate microservice (outside this folder, at repository root) responsible for job discovery and advanced matching logic.

## High-Level Flow

1. User enters or updates resume/profile data in `web`.
2. `server` stores and normalizes profile data.
3. `server` calls `joblake` for job search + advanced match computation.
4. `server` returns ranked recommendations with match scores to `web`.
5. User can request AI interview questions and custom resumes for a selected job.

## Local Development

Install dependencies:

```bash
bun install
```

Run apps in development:

```bash
bun run dev
```

Default local URLs:

- Web: `http://localhost:3006`
- Server API: `http://localhost:3005`
