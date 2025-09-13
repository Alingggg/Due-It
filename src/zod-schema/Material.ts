import * as z from "zod";

const MaterialGroupSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  subjectId: z.string().min(1, "Subject is required"),
});

export { MaterialGroupSchema };
