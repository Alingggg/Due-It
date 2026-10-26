import type { Request, Response } from "express";
import { workspaceService } from "../services/index.ts";
import {
  codeStatusSchema,
  defaultSemesterSchema,
  inviteCodeSchema,
  memberRoleSchema,
  workspaceNameSchema,
} from "../zod-schema/index.ts";

export async function getMyWorkspaces(req: Request, res: Response) {
  res.json(await workspaceService.getMyWorkspaces(req.userId));
}

export async function createWorkspace(req: Request, res: Response) {
  const { name } = workspaceNameSchema.parse(req.body);

  res.status(201).json(await workspaceService.createWorkspace(req.userId, name));
}

export async function joinWorkspace(req: Request, res: Response) {
  const { code } = inviteCodeSchema.parse(req.body);

  res.json(await workspaceService.joinWorkspace(req.userId, code));
}

export async function updateWorkspaceName(req: Request, res: Response) {
  const { name } = workspaceNameSchema.parse(req.body);

  res.json(await workspaceService.updateWorkspaceName(req.workspace, req.role, name));
}

export async function updateDefaultSemester(req: Request, res: Response) {
  const { semester } = defaultSemesterSchema.parse(req.body);

  res.json(await workspaceService.updateDefaultSemester(req.workspace, req.role, semester));
}

export async function deleteWorkspace(req: Request, res: Response) {
  await workspaceService.deleteWorkspace(req.workspace);

  res.status(204).end();
}

export function getCode(req: Request, res: Response) {
  res.json(workspaceService.getCode(req.workspace));
}

export async function renewCode(req: Request, res: Response) {
  res.json(await workspaceService.renewCode(req.workspace));
}

export async function updateCodeStatus(req: Request, res: Response) {
  const { enabled } = codeStatusSchema.parse(req.body);

  res.json(await workspaceService.updateCodeStatus(req.workspace, enabled));
}

export async function getMembers(req: Request, res: Response) {
  res.json(await workspaceService.getMembers(req.workspace));
}

// admin only: promoting someone to admin hands the role over and demotes the caller
export async function updateMemberRole(req: Request, res: Response) {
  const { role } = memberRoleSchema.parse(req.body);

  await workspaceService.updateMemberRole(
    req.workspace,
    req.userId,
    String(req.params.userId),
    role,
  );

  res.status(204).end();
}

// leaving yourself, or kicking: admin kicks anyone, co-admin kicks members only
export async function deleteMember(req: Request, res: Response) {
  await workspaceService.deleteMember(
    req.workspace,
    req.userId,
    req.role,
    String(req.params.userId),
  );

  res.status(204).end();
}
