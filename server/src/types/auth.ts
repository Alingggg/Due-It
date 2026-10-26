import type * as z from "zod";
import type { loginSchema, profileSchema, registerSchema } from "../zod-schema/index.ts";

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
