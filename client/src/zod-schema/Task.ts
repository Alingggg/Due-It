import { format, isValid } from "date-fns";
import * as z from "zod";
import { TimeSchema } from "./common";

const TaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: "Title is required" })
    .max(100, { error: "Title is too long" }),
  description: z.string().trim().max(500, { error: "Description is too long" }),
  subjectId: z.string().min(1, { error: "Subject is required" }),
  taskType: z.enum(["exam", "activity"], {
    error: "Invalid or missing task type",
  }),
  completionType: z.enum(["individual", "pair", "group"], {
    error: "Invalid or missing completion type",
  }),
  dueDate: z
    .any()
    .refine((val) => val !== undefined && val !== null && val !== "", {
      error: "Due date is required",
    })
    .refine(
      (val) => {
        if (val instanceof Date && isValid(val)) return true;
        if (typeof val === "string") {
          const parsed = new Date(val);
          return isValid(parsed);
        }
        return false;
      },
      { error: "Due date must be a valid date" }
    )
    .transform((val) => {
      if (val instanceof Date && isValid(val)) return format(val, "yyyy-MM-dd");
      if (typeof val === "string") {
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
        const parsed = new Date(val);
        if (isValid(parsed)) return format(parsed, "yyyy-MM-dd");
      }
      return val;
    }),
  dueTime: TimeSchema,
});

export { TaskSchema };
