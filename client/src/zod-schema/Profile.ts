import * as z from "zod";

const ProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { error: "First name is required" })
    .max(32, { error: "First name is too long" }),
  lastName: z
    .string()
    .trim()
    .min(1, { error: "Last name is required" })
    .max(32, { error: "Last name is too long" }),
});

export { ProfileSchema };
