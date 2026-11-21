import type * as z from "zod";
import type { WorkspaceNameSchema, WorkspaceSchema } from "@/zod-schema";
import type { Semester } from "./Semester";

type WorkspaceRole = "admin" | "co-admin" | "member";

interface UserWorkspace {
  id: string;
  name: string;
  defaultSemester: Semester;
  role: WorkspaceRole;
}

type CreateWorkspaceInput = z.infer<typeof WorkspaceSchema>;

type WorkspaceNameInput = z.infer<typeof WorkspaceNameSchema>;

export type {
  CreateWorkspaceInput,
  UserWorkspace,
  WorkspaceNameInput,
  WorkspaceRole,
};
