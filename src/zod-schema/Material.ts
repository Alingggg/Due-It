import * as z from "zod";

const MaterialGroupSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: "Title is required" })
    .max(100, { error: "Title is too long" }),
  description: z.string().trim().optional(),
  subjectId: z.string().min(1, { error: "Subject is required" }),
});

const MaterialSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Name is required" })
    .max(100, { error: "Name is too long" }),
  isLink: z.boolean(),
  url: z.string().optional(),
  size: z.number().optional(),
  type: z.string().optional(),
});

const MaterialsSchema = z
  .object({
    files: z.array(MaterialSchema),
    links: z.array(MaterialSchema),
  })
  .refine((data) => data.files.length + data.links.length >= 1, {
    error: "At least one material or link is required",
    path: ["files"], // You can also use ["links"] or [] for a general error
  });

export { MaterialGroupSchema, MaterialSchema, MaterialsSchema };
