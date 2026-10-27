import type { NextFunction, Request, Response } from "express";
import type { WorkspaceRole } from "../models/index.ts";
import { workspaceService } from "../services/index.ts";

export async function requireMember(req: Request, _res: Response, next: NextFunction) {
  const { workspace, role } = await workspaceService.getMembership(
    String(req.params.workspaceId),
    req.userId,
  );

  req.workspace = workspace;
  req.role = role;
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
