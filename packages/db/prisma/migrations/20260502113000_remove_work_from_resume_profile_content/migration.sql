UPDATE resume_profile
SET
  "content" = "content" - 'work',
  "sectionOrder" = (
    SELECT COALESCE(jsonb_agg(item), '[]'::jsonb)
    FROM jsonb_array_elements("sectionOrder") AS t(item)
    WHERE item <> '"work"'::jsonb
  )
WHERE ("content" ? 'work')
   OR ("sectionOrder" @> '["work"]'::jsonb);
