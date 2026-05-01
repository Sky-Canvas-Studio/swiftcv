import { t } from "elysia";

export const UpdateProfileDto = t.Object({
  language: t.Optional(t.String({ minLength: 2, maxLength: 12 })),
  photoUrl: t.Optional(t.Union([t.String({ maxLength: 1000 }), t.Null()])),
  headline: t.Optional(t.Union([t.String({ maxLength: 180 }), t.Null()])),
  summary: t.Optional(t.Union([t.String({ maxLength: 4000 }), t.Null()])),
  content: t.Optional(t.Any()),
  sectionOrder: t.Optional(t.Array(t.String())),
});

export type UpdateProfileInput = typeof UpdateProfileDto.static;
