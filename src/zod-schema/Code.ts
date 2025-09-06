import * as z from "zod";

const codeSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(8, "Code is too long")
    .regex(
      /^[a-z2-9]+$/,
      "Code can only contain lowercase letters and numbers"
    ),
});

export { codeSchema };
