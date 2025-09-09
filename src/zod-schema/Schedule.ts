import * as z from "zod";
import { parse, isValid } from "date-fns";

const ScheduleSchema = z.object({
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
      const parsed = parse(val, "HH:mm", new Date());
      return isValid(parsed);
    },
    { error: "Invalid time format (expected HH:mm)" }
  ),
  endTime: z.string().refine(
    (val) => {
      const parsed = parse(val, "HH:mm", new Date());
      return isValid(parsed);
    },
    { error: "Invalid time format (expected HH:mm)" }
  ),
});

export { ScheduleSchema };
