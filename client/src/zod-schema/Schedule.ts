import * as z from "zod";
import { TimeSchema } from "./common";

function withSeconds(time: string) {
  return time.length === 5 ? `${time}:00` : time;
}

const ScheduleSchema = z
  .object({
    subjectId: z.string().min(1, { error: "Subject is required" }),
    dayOfWeek: z.enum(
      [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ],
      {
        error: "Day of week is required",
      }
    ),
    startTime: TimeSchema,
    endTime: TimeSchema,
  })
  .refine(
    ({ startTime, endTime }) => withSeconds(endTime) > withSeconds(startTime),
    { error: "End time must be after start time", path: ["endTime"] }
  );

export { ScheduleSchema };
