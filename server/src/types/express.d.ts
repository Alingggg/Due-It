import type { WorkspaceModel, WorkspaceRole } from "../models/index.ts";

// set by the middleware in src/middleware
declare global {
  namespace Express {
    interface Request {
      // requireAuth
      userId: string;
      // requireMember
      workspace: InstanceType<typeof WorkspaceModel>;
      role: WorkspaceRole;
    }
  }
}
