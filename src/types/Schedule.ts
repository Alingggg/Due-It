import { Database } from "@/types/supabase";

interface SemesterSchedule {
  id: string;
  subjectId: string;
  semester: number;
  dayOfWeek: Database["public"]["Enums"]["day_of_week"];
  startTime: string;
  endTime: string;
  subjectName: string;
}

export type { SemesterSchedule };
