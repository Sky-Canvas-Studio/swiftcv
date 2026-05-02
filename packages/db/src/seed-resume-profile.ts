import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import type { Prisma } from "../prisma/generated/client";
import {
  buildProfileContent,
  cleanText,
  seededSectionOrder,
  type ResumeJson,
} from "./resume-profile-mapper";

const TARGET_EMAIL = "khalidk8774@gmail.com";
const RESUME_PATH = new URL("../../../../resume.json", import.meta.url);
const ENV_PATH = fileURLToPath(new URL("../../../apps/server/.env", import.meta.url));

async function main() {
  dotenv.config({ path: ENV_PATH });
  const { default: prisma } = await import("./index");
  const user = await prisma.user.findUnique({ where: { email: TARGET_EMAIL } });
  if (!user) {
    throw new Error(`No user found with email ${TARGET_EMAIL}`);
  }

  const resume = JSON.parse(await readFile(RESUME_PATH, "utf8")) as ResumeJson;
  const content = buildProfileContent(resume);

  const profile = await prisma.resumeProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      language: "en",
      headline: "Full-Stack TypeScript Engineer",
      summary: cleanText(resume.summary),
      content: content as Prisma.InputJsonValue,
      sectionOrder: seededSectionOrder as Prisma.InputJsonValue,
    },
    update: {
      language: "en",
      headline: "Full-Stack TypeScript Engineer",
      summary: cleanText(resume.summary),
      content: content as Prisma.InputJsonValue,
      sectionOrder: seededSectionOrder as Prisma.InputJsonValue,
    },
  });

  console.log(`Seeded resume profile ${profile.id} for ${TARGET_EMAIL}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const { default: prisma } = await import("./index");
    await prisma.$disconnect();
  });
