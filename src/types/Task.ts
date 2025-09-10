import { Database } from "@/types/supabase";

interface SemesterTask {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  completionType: Database["public"]["Enums"]["completion_type"];
  taskType: Database["public"]["Enums"]["task_type"];
  dueDate: string;
  semester: number;
  subjectName: string;
}

export type { SemesterTask };
