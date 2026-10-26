import type { WorkspaceRole } from "./Workspace";

interface WorkspaceMemberWithProfile {
  workspaceId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: WorkspaceRole;
}

export type { WorkspaceMemberWithProfile };
