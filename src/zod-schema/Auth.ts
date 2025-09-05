import * as z from "zod";

const authFields = {
  email: z
    .string()
    .min(1, { error: "Email is required" })
    .email({ error: "Invalid email format" }),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, { error: "Password must be at least 8 characters" })
    .max(64, { error: "Password must be at most 64 characters" })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).+$/, {
      error: "Must include upper & lowercase letters, a number, and a symbol",
    }),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(32, "Name must be at most 32 characters")
    .regex(
      /^[\p{L}\s'-]+$/u,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
};

const registerSchema = z
  .object({
    email: authFields.email,
    password: authFields.password,
    firstName: authFields.name,
    lastName: authFields.name,
    confirmPassword: z
      .string()
      .min(1, { error: "Confirm password is required" }),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export { registerSchema };
