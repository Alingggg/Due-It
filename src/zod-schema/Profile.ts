import * as z from "zod";

const ProfileSchema = z.object({
  firstName: z
    .string({ error: "First name must be a string" })
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  lastName: z
    .string({ error: "Last name must be a string" })
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
});

export { ProfileSchema };
