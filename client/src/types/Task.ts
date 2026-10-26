import type { Semester } from "./Semester";

type TaskType = "activity" | "exam";

type CompletionType = "individual" | "pair" | "group";

interface SemesterTask {
  id: string;
  subjectId: string;
  title: string;
  description: string | null;
  completionType: CompletionType;
  taskType: TaskType;
  dueDate: string;
  dueTime: string;
  semester: Semester;
  subjectName: string;
  isCompleted: boolean;
}

interface Task {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  completionType: CompletionType;
  taskType: TaskType;
  dueDate: string;
  dueTime: string;
}

interface TaskFilters {
  dueFrom?: string;
  dueTo?: string;
  completed?: boolean;
}

export type { CompletionType, SemesterTask, Task, TaskFilters, TaskType };
