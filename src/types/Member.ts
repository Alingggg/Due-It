import type { Database } from "@/types";

interface WorkspaceMemberWithProfile {
  workspaceId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Database["public"]["Enums"]["workspace_role"];
}

export type { WorkspaceMemberWithProfile };
