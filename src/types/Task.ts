import { Database } from "@/types/supabase";

interface SemesterTask {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  completionType: Database["public"]["Enums"]["completion_type"];
  taskType: Database["public"]["Enums"]["task_type"];
  dueDate: string;
  dueTime: string;
  semester: number;
  subjectName: string;
}

interface Task {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  completionType: Database["public"]["Enums"]["completion_type"];
  taskType: Database["public"]["Enums"]["task_type"];
  dueDate: string;
  dueTime: string;
}

export type { SemesterTask, Task };
