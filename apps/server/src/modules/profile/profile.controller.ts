import { Elysia } from "elysia";
import { authGuard } from "@/guards/auth.guard";
import { profileService } from "./profile.service";
import { UpdateProfileDto } from "./profile.dto";

export const profileController = new Elysia({
  prefix: "/profile",
  detail: { tags: ["Profile"] },
})
  .use(authGuard)
  .get(
    "/",
    async ({ user, userId, set }) => {
      if (!userId || !user) {
        set.status = 401;
        return { message: "Unauthorized", status: 401 };
      }

      return profileService.getOrCreateProfile({
        id: userId,
        name: user.name,
        email: user.email,
      });
    },
    { detail: { summary: "Get current user's resume profile" } },
  )
  .patch(
    "/",
    async ({ body, userId, set }) => {
      if (!userId) {
        set.status = 401;
        return { message: "Unauthorized", status: 401 };
      }

      const profile = await profileService.updateProfile(userId, body);
      return { success: true, profile };
    },
    {
      body: UpdateProfileDto,
      detail: { summary: "Update current user's resume profile" },
    },
  );
