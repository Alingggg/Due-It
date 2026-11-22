import type * as z from "zod";
import type { LoginSchema, RegisterSchema } from "@/zod-schema";

type RegisterInput = z.infer<typeof RegisterSchema>;
type LoginInput = z.infer<typeof LoginSchema>;

export type { LoginInput, RegisterInput };
