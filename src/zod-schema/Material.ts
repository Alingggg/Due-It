import * as z from "zod";

const MaterialGroupSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  subjectId: z.string().min(1, "Subject is required"),
});

const MaterialSchema = z.object({
  name: z.string().min(1, "Name is required"),
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
    message: "At least one material or link is required",
    path: ["files"], // You can also use ["links"] or [] for a general error
  });

export { MaterialGroupSchema, MaterialSchema, MaterialsSchema };
