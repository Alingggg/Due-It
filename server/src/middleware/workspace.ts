import type { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { WorkspaceModel, type WorkspaceRole } from "../models/index.ts";

// loads :workspaceId and checks the signed-in user is a member of it
export async function requireMember(req: Request, res: Response, next: NextFunction) {
  const { workspaceId } = req.params;

  const workspace = isValidObjectId(workspaceId)
    ? await WorkspaceModel.findById(workspaceId)
    : null;

  if (!workspace) {
    res.status(404).json({ message: "Workspace not found" });
    return;
  }

  const member = workspace.members.find((m) => m.userId.equals(req.userId));

  if (!member) {
    res.status(403).json({ message: "You are not a member of this workspace" });
    return;
  }

  req.workspace = workspace;
  req.role = member.role as WorkspaceRole;
  next();
}

export function requireRole(...roles: WorkspaceRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.role)) {
      res.status(403).json({ message: "You don't have permission to do this" });
      return;
    }

    next();
  };
}
