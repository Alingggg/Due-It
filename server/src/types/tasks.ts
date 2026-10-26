import type * as z from "zod";
import type { taskSchema, tasksQuerySchema } from "../zod-schema/index.ts";

export type TasksQuery = z.infer<typeof tasksQuerySchema>;
export type TaskInput = z.infer<typeof taskSchema>;
