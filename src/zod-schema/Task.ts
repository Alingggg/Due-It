import { isValid, parse } from "date-fns";
import * as z from "zod";

const TaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long"),
  subjectId: z.string().min(1, "Subject is required"),
  taskType: z.enum(["quiz", "activity"]),
  completionType: z.enum(["individual", "pair", "group"]),
  dueDate: z
    .any()
    .refine(
      (val) => {
        if (val instanceof Date && isValid(val)) return true;
        if (typeof val === "string") {
          const parsed = new Date(val);
          return isValid(parsed);
        }
        return false;
      },
      { message: "Due date is required and must be a valid date" }
    )
    .transform((val) => {
      if (val instanceof Date && isValid(val)) return val.toISOString();
      if (typeof val === "string") {
        const parsed = new Date(val);
        if (isValid(parsed)) return parsed.toISOString();
      }
      return val;
    }),
  dueTime: z.string().refine(
    (val) => {
      const parsed = parse(val, "HH:mm", new Date());
      return isValid(parsed);
    },
    { message: "Invalid time format (expected HH:mm)" }
  ),
});

export { TaskSchema };
