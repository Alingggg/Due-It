import type { Semester } from "./Semester";

type WorkspaceRole = "admin" | "co-admin" | "member";

interface UserWorkspace {
  id: string;
  name: string;
  defaultSemester: Semester;
  role: WorkspaceRole;
}

export type { UserWorkspace, WorkspaceRole };
