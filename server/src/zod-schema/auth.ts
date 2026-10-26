import * as z from "zod";

const email = z.string().trim().toLowerCase().email();

const name = z.string().trim().min(1).max(32);

export const registerSchema = z.object({
  email,
  password: z.string().min(8).max(64),
  firstName: name,
  lastName: name,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1),
});

export const profileSchema = z.object({
  firstName: name,
  lastName: name,
});
