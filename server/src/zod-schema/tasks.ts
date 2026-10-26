import * as z from "zod";

export const tasksQuerySchema = z.object({
  semester: z.coerce.number().int(),
  dueFrom: z.coerce.date().optional(),
  dueTo: z.coerce.date().optional(),
  completed: z.enum(["true", "false"]).optional(),
});

// dueTime is checked by the model (see models/common.ts)
export const taskSchema = z.object({
  subjectId: z.string(),
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).nullish(),
  taskType: z.enum(["activity", "exam"]),
  completionType: z.enum(["individual", "pair", "group"]),
  dueDate: z.coerce.date(),
  dueTime: z.string(),
});

export const taskCompletionSchema = z.object({ done: z.boolean() });
