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

export type { DayOfWeek, SemesterSchedule };
