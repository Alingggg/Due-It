import type { Semester } from "./Semester";

interface Subject {
  id: string;
  workspaceId: string;
  semester: Semester;
  name: string;
  subjectCode: string;
  instructorName: string;
}

export type { Subject };
