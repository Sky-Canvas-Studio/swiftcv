import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/client";
import { normalizeProfile } from "./profile-utils";
import type { ResumeProfile } from "./types";

export const profileQueryKey = ["profile"] as const;

export function useProfileQuery() {
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: async () => {
      const { data, error } = await client.profile.get();
      if (error) throw new Error("Unable to load profile");
      return normalizeProfile(data);
    },
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: ResumeProfile) => {
      const { data, error } = await client.profile.patch({
        language: profile.language,
        photoUrl: profile.photoUrl,
        headline: profile.headline,
        summary: profile.summary,
        content: profile.content,
        sectionOrder: profile.sectionOrder,
      });

      if (error) throw new Error("Unable to save profile");
      return normalizeProfile(data.profile);
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(profileQueryKey, profile);
      toast.success("Profile saved");
    },
    onError: () => toast.error("Could not save profile"),
  });
}
