import type * as z from "zod";
import type { ScheduleSchema } from "@/zod-schema";
import type { Semester } from "./Semester";

type DayOfWeek =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

interface SemesterSchedule {
  id: string;
  subjectId: string;
  semester: Semester;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  subjectName: string;
}

type ScheduleFormInput = z.infer<typeof ScheduleSchema>;

type ScheduleInput = Pick<
  SemesterSchedule,
  "subjectId" | "dayOfWeek" | "startTime" | "endTime"
>;

export type { DayOfWeek, ScheduleFormInput, ScheduleInput, SemesterSchedule };
