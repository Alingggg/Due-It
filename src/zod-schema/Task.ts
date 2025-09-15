import { isValid, parse } from "date-fns";
import * as z from "zod";

const TaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: "Title is required" })
    .max(100, { error: "Title is too long" }),
  description: z.string().trim().max(500, { error: "Description is too long" }),
  subjectId: z.string().min(1, { error: "Subject is required" }),
  taskType: z.enum(["exam", "activity"]),
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
      { error: "Due date is required and must be a valid date" }
    )
    .transform((val) => {
      if (val instanceof Date && isValid(val)) return val.toLocaleDateString();
      if (typeof val === "string") {
        const parsed = new Date(val);
        if (isValid(parsed)) return parsed.toLocaleDateString();
      }
      return val;
    }),
  dueTime: z.string().refine(
    (val) => {
      const parsedWithSeconds = parse(val, "HH:mm:ss", new Date());
      const parsedWithoutSeconds = parse(val, "HH:mm", new Date());
      return isValid(parsedWithSeconds) || isValid(parsedWithoutSeconds);
    },
    { error: "Invalid time format (expected HH:mm or HH:mm:ss)" }
  ),
});

export { TaskSchema };
