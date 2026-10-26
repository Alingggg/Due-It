import type { Request, Response } from "express";
import { UserModel, WorkspaceModel, type WorkspaceRole } from "../models/index.ts";
import {
  codeStatusSchema,
  defaultSemesterSchema,
  inviteCodeSchema,
  memberRoleSchema,
  workspaceNameSchema,
} from "../zod-schema/index.ts";
import { deleteSubjects, generateInviteCode, removeUploads } from "../utils/index.ts";

type Workspace = Request["workspace"];

function toUserWorkspace(workspace: Workspace, role: WorkspaceRole) {
  return {
    id: workspace.id,
    name: workspace.name,
    defaultSemester: workspace.defaultSemester,
    role,
  };
}

function toCode(workspace: Workspace) {
  const { code, enabled, updatedAt } = workspace.invite;
  return { workspaceId: workspace.id, code, enabled, updatedAt };
}

async function uniqueInviteCode() {
  let code = generateInviteCode();
  while (await WorkspaceModel.exists({ "invite.code": code })) code = generateInviteCode();
  return code;
}

function findUserWorkspace(userId: string) {
  return WorkspaceModel.findOne({ "members.userId": userId });
}

export async function getMyWorkspace(req: Request, res: Response) {
  const workspace = await findUserWorkspace(req.userId);

  if (!workspace) {
    res.json(null);
    return;
  }

  const member = workspace.members.find((m) => m.userId.equals(req.userId))!;
  res.json(toUserWorkspace(workspace, member.role as WorkspaceRole));
}

export async function createWorkspace(req: Request, res: Response) {
  const { name } = workspaceNameSchema.parse(req.body);

  if (await findUserWorkspace(req.userId)) {
    res.status(409).json({ message: "You are already in a workspace" });
    return;
  }

  const workspace = await WorkspaceModel.create({
    name,
    invite: { code: await uniqueInviteCode() },
    members: [{ userId: req.userId, role: "admin" }],
  });

  res.status(201).json(toUserWorkspace(workspace, "admin"));
}

export async function joinWorkspace(req: Request, res: Response) {
  const { code } = inviteCodeSchema.parse(req.body);

  if (await findUserWorkspace(req.userId)) {
    res.status(409).json({ message: "You are already in a workspace" });
    return;
  }

  const workspace = await WorkspaceModel.findOne({ "invite.code": code });

  if (!workspace) {
    res.status(404).json({ message: "Invalid invite code" });
    return;
  }

  if (!workspace.invite.enabled) {
    res.status(403).json({ message: "Invite code is disabled" });
    return;
  }

  workspace.members.push({ userId: req.userId, role: "member" });
  await workspace.save();

  res.json(toUserWorkspace(workspace, "member"));
}

export async function updateWorkspaceName(req: Request, res: Response) {
  const { name } = workspaceNameSchema.parse(req.body);

  req.workspace.name = name;
  await req.workspace.save();

  res.json(toUserWorkspace(req.workspace, req.role));
}

export async function updateDefaultSemester(req: Request, res: Response) {
  const { semester } = defaultSemesterSchema.parse(req.body);

  req.workspace.defaultSemester = semester;
  await req.workspace.save();

  res.json(toUserWorkspace(req.workspace, req.role));
}

export async function deleteWorkspace(req: Request, res: Response) {
  await deleteSubjects({ workspaceId: req.workspace._id });
  await removeUploads(req.workspace._id);
  await req.workspace.deleteOne();

  res.status(204).end();
}

export function getCode(req: Request, res: Response) {
  res.json(toCode(req.workspace));
}

export async function renewCode(req: Request, res: Response) {
  req.workspace.invite.code = await uniqueInviteCode();
  req.workspace.invite.updatedAt = new Date();
  await req.workspace.save();

  res.json(toCode(req.workspace));
}

export async function updateCodeStatus(req: Request, res: Response) {
  const { enabled } = codeStatusSchema.parse(req.body);

  req.workspace.invite.enabled = enabled;
  await req.workspace.save();

  res.json(toCode(req.workspace));
}

export async function getMembers(req: Request, res: Response) {
  const { members } = req.workspace;
  const users = await UserModel.find({ _id: { $in: members.map((m) => m.userId) } });

  res.json(
    users.map((user) => ({
      workspaceId: req.workspace.id,
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: members.find((m) => m.userId.equals(user._id))!.role,
    })),
  );
}

// admin only: promoting someone to admin hands the role over and demotes the caller
export async function updateMemberRole(req: Request, res: Response) {
  const { role } = memberRoleSchema.parse(req.body);
  const { members } = req.workspace;

  if (req.params.userId === req.userId) {
    res.status(400).json({ message: "You can't change your own role" });
    return;
  }

  const target = members.find((m) => m.userId.equals(String(req.params.userId)));

  if (!target) {
    res.status(404).json({ message: "Member not found" });
    return;
  }

  target.role = role;
  if (role === "admin") members.find((m) => m.userId.equals(req.userId))!.role = "co-admin";
  await req.workspace.save();

  res.status(204).end();
}

// leaving yourself, or kicking: admin kicks anyone, co-admin kicks members only
export async function deleteMember(req: Request, res: Response) {
  const target = req.workspace.members.find((m) =>
    m.userId.equals(String(req.params.userId)),
  );

  if (!target) {
    res.status(404).json({ message: "Member not found" });
    return;
  }

  if (target.userId.equals(req.userId)) {
    if (req.role === "admin") {
      res.status(400).json({ message: "Transfer the admin role before leaving" });
      return;
    }
  } else if (!(req.role === "admin" || (req.role === "co-admin" && target.role === "member"))) {
    res.status(403).json({ message: "You don't have permission to do this" });
    return;
  }

  await WorkspaceModel.updateOne(
    { _id: req.workspace._id },
    { $pull: { members: { userId: target.userId } } },
  );

  res.status(204).end();
}
