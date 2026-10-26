import * as z from "zod";

export const subjectSchema = z.object({
  name: z.string().trim().min(1).max(100),
  subjectCode: z.string().trim().min(1).max(15),
  instructorName: z.string().trim().min(1).max(100),
  semester: z.number().int(),
});

// times are checked by the model (see models/common.ts)
export const scheduleSchema = z.object({
  subjectId: z.string(),
  dayOfWeek: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});
