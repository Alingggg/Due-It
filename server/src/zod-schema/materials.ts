import * as z from "zod";
import { MAX_FILE_SIZE } from "../utils/s3.ts";

export const ALLOWED_EXTENSIONS = [
  "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt", "jpg", "jpeg", "png", "zip", "rar",
];
const MAX_FILES = 20;

export const materialGroupSchema = z.object({
  subjectId: z.string(),
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().nullish(),
});

const fileNameSchema = z.string().trim().min(1).max(255);

export const uploadRequestSchema = z.object({
  files: z
    .array(
      z.object({
        name: fileNameSchema.refine(
          (name) => ALLOWED_EXTENSIONS.includes(name.split(".").pop()!.toLowerCase()),
          "File type not allowed",
        ),
        size: z.int().min(1).max(MAX_FILE_SIZE, "File is larger than 50 MB"),
        type: z.string().max(255),
      }),
    )
    .min(1)
    .max(MAX_FILES),
});

export const addMaterialsSchema = z.object({
  links: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(100),
        url: z.url({ protocol: /^https?$/ }),
      }),
    )
    .default([]),
  files: z
    .array(z.object({ key: z.string(), name: fileNameSchema }))
    .max(MAX_FILES)
    .default([]),
});
