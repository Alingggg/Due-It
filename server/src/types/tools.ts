import type { WorkspaceModel, WorkspaceRole } from "../models/index.ts";

export type ToolContext = {
  userId: string;
  workspace: InstanceType<typeof WorkspaceModel>;
  role: WorkspaceRole;
};
