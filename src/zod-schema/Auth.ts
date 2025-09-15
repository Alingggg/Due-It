import * as z from "zod";

const AuthFields = {
  email: z
    .string()
    .trim()
    .min(1, { error: "Email is required" })
    .email({ error: "Invalid email format" }),
  password: z
    .string()
    .min(1, { error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters" })
    .max(64, { error: "Password must be at most 64 characters" })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).+$/, {
      error: "Must include upper & lowercase letters, a number, and a symbol",
    }),
  name: z
    .string()
    .trim()
    .min(2, { error: "Name must be at least 2 characters" })
    .max(32, { error: "Name must be at most 32 characters" })
    .regex(/^[\p{L}\s'-]+$/u, {
      error: "Name can only contain letters, spaces, hyphens, and apostrophes",
    }),
};

const RegisterSchema = z
  .object({
    email: AuthFields.email,
    password: AuthFields.password,
    firstName: AuthFields.name,
    lastName: AuthFields.name,
    confirmPassword: z
      .string()
      .trim()
      .min(1, { error: "Confirm password is required" }),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

const LoginSchema = z.object({
  email: AuthFields.email,
  password: AuthFields.password,
});

export { RegisterSchema, LoginSchema };
