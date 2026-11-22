import type * as z from "zod";
import type { WorkspaceNameSchema } from "@/zod-schema";
import type { Semester } from "./Semester";

type WorkspaceRole = "admin" | "co-admin" | "member";

interface UserWorkspace {
  id: string;
  name: string;
  defaultSemester: Semester;
  role: WorkspaceRole;
}

type WorkspaceNameInput = z.infer<typeof WorkspaceNameSchema>;

export type { UserWorkspace, WorkspaceNameInput, WorkspaceRole };
