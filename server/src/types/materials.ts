import type * as z from "zod";
import type { materialGroupSchema, materialLinksSchema } from "../zod-schema/index.ts";

export type MaterialGroupInput = z.infer<typeof materialGroupSchema>;
export type MaterialLinks = z.infer<typeof materialLinksSchema>;
