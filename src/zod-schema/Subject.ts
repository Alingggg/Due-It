import * as z from "zod";

const SubjectSchema = z.object({
  name: z.string().trim().min(1, "Subject name is required"),
  subjectCode: z.string().trim().min(1, "Subject code is required"),
  instructorName: z.string().trim().min(1, "Instructor name is required"),
});

export { SubjectSchema };
