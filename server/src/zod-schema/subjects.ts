import * as z from "zod";
import { semesterSchema } from "./common.ts";

export const subjectSchema = z.object({
  name: z.string().trim().min(1).max(100),
  subjectCode: z.string().trim().min(1).max(15),
  instructorName: z.string().trim().min(1).max(100),
  semester: semesterSchema,
});

const withSeconds = (time: string) => (time.length === 5 ? `${time}:00` : time);

// times are checked by the model (see models/common.ts)
export const scheduleSchema = z
  .object({
    subjectId: z.string(),
    dayOfWeek: z.string(),
    startTime: z.string(),
    endTime: z.string(),
  })
  .refine(({ startTime, endTime }) => withSeconds(endTime) > withSeconds(startTime), {
    message: "End time must be after start time",
    path: ["endTime"],
  });
