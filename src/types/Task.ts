import type { Database } from "@/types";

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
  isCompleted: boolean;
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
