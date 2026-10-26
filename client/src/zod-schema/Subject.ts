import * as z from "zod";

const SubjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Subject name is required" })
    .max(100, { error: "Subject name is too long" }),
  subjectCode: z
    .string()
    .trim()
    .min(1, { error: "Subject code is required" })
    .max(15, { error: "Subject code is too long" }),
  instructorName: z
    .string()
    .trim()
    .min(1, { error: "Instructor name is required" })
    .max(100, { error: "Instructor name is too long" }),
});

export { SubjectSchema };
