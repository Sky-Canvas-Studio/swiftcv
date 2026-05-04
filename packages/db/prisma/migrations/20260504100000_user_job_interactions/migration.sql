CREATE TABLE "user_job_interaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobKey" TEXT NOT NULL,
    "source" TEXT,
    "sourceJobId" TEXT,
    "fingerprint" TEXT,
    "clickedAt" TIMESTAMP(3),
    "dismissedAt" TIMESTAMP(3),
    "lastVisitedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_job_interaction_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_job_interaction_userId_jobKey_key"
ON "user_job_interaction"("userId", "jobKey");

CREATE INDEX "user_job_interaction_userId_clickedAt_idx"
ON "user_job_interaction"("userId", "clickedAt");

CREATE INDEX "user_job_interaction_userId_dismissedAt_idx"
ON "user_job_interaction"("userId", "dismissedAt");

ALTER TABLE "user_job_interaction"
ADD CONSTRAINT "user_job_interaction_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "user"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
