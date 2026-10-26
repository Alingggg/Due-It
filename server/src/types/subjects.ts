import type * as z from "zod";
import type { scheduleSchema, subjectSchema } from "../zod-schema/index.ts";

export type SubjectInput = z.infer<typeof subjectSchema>;
export type ScheduleInput = z.infer<typeof scheduleSchema>;
