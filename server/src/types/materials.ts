import type * as z from "zod";
import type {
  addMaterialsSchema,
  materialGroupSchema,
  uploadRequestSchema,
} from "../zod-schema/index.ts";

export type MaterialGroupInput = z.infer<typeof materialGroupSchema>;
export type UploadRequest = z.infer<typeof uploadRequestSchema>;
export type AddMaterialsInput = z.infer<typeof addMaterialsSchema>;
