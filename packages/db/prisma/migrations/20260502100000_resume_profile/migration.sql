CREATE TABLE "resume_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "photoUrl" TEXT,
    "headline" TEXT,
    "summary" TEXT,
    "content" JSONB NOT NULL,
    "sectionOrder" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resume_profile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "resume_profile_userId_key" ON "resume_profile"("userId");
CREATE INDEX "resume_profile_userId_idx" ON "resume_profile"("userId");

ALTER TABLE "resume_profile"
ADD CONSTRAINT "resume_profile_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "user"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
