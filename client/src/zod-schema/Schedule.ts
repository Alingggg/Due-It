import * as z from "zod";
import { parse, isValid } from "date-fns";

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
    startTime: z.string().refine(
      (val) => {
        const parsedWithSeconds = parse(val, "HH:mm:ss", new Date());
        const parsedWithoutSeconds = parse(val, "HH:mm", new Date());
        return isValid(parsedWithSeconds) || isValid(parsedWithoutSeconds);
      },
      { error: "Invalid time format (expected HH:mm or HH:mm:ss)" }
    ),
    endTime: z.string().refine(
      (val) => {
        const parsedWithSeconds = parse(val, "HH:mm:ss", new Date());
        const parsedWithoutSeconds = parse(val, "HH:mm", new Date());
        return isValid(parsedWithSeconds) || isValid(parsedWithoutSeconds);
      },
      { error: "Invalid time format (expected HH:mm or HH:mm:ss)" }
    ),
  })
  .refine(
    ({ startTime, endTime }) => withSeconds(endTime) > withSeconds(startTime),
    { error: "End time must be after start time", path: ["endTime"] }
  );

export { ScheduleSchema };
