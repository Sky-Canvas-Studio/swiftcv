import prisma from "@db";
import type { Prisma } from "@db";
import { createDefaultProfileContent, defaultSectionOrder } from "./profile.defaults";
import type { UpdateProfileInput } from "./profile.dto";

type ProfileUser = {
  id: string;
  name?: string | null;
  email?: string | null;
};

const profileSelect = {
  id: true,
  userId: true,
  language: true,
  photoUrl: true,
  headline: true,
  summary: true,
  content: true,
  sectionOrder: true,
} satisfies Prisma.ResumeProfileSelect;

export const profileService = {
  async getOrCreateProfile(user: ProfileUser) {
    const existing = await prisma.resumeProfile.findUnique({
      where: { userId: user.id },
      select: profileSelect,
    });

    if (existing) return existing;

    return prisma.resumeProfile.create({
      select: profileSelect,
      data: {
        userId: user.id,
        language: "en",
        content: createDefaultProfileContent(user) as Prisma.InputJsonValue,
        sectionOrder: defaultSectionOrder as Prisma.InputJsonValue,
      },
    });
  },

  async updateProfile(userId: string, input: UpdateProfileInput) {
    return prisma.resumeProfile.update({
      where: { userId },
      select: profileSelect,
      data: {
        language: input.language,
        photoUrl: input.photoUrl,
        headline: input.headline,
        summary: input.summary,
        content: input.content as Prisma.InputJsonValue | undefined,
        sectionOrder: input.sectionOrder as Prisma.InputJsonValue | undefined,
      },
    });
  },
};
