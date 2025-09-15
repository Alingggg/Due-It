import * as z from "zod";

const CodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, { error: "Code is required" })
    .max(8, { error: "Code is too long" })
    .regex(/^[a-z1-9]+$/, {
      error: "Code can only contain lowercase letters and numbers",
    }),
});

export { CodeSchema };
