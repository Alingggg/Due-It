import * as z from "zod";

export const materialGroupSchema = z.object({
  subjectId: z.string(),
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().nullish(),
});

// multipart field, sent as a JSON string next to the files
export const materialLinksSchema = z
  .string()
  .default("[]")
  .transform((value) => JSON.parse(value))
  .pipe(
    z.array(
      z.object({
        name: z.string().trim().min(1).max(100),
        url: z.url({ protocol: /^https?$/ }),
      }),
    ),
  );
