import { UserModel, WorkspaceModel, type WorkspaceRole } from "../models/index.ts";
import { HttpError, deleteSubjects, generateInviteCode, removeUploads } from "../utils/index.ts";

type Workspace = InstanceType<typeof WorkspaceModel>;

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

export async function getMyWorkspaces(userId: string) {
  const workspaces = await WorkspaceModel.find({ "members.userId": userId }).sort({ name: 1 });

  return workspaces.map((workspace) => {
    const member = workspace.members.find((m) => m.userId.equals(userId))!;
    return toUserWorkspace(workspace, member.role as WorkspaceRole);
  });
}

export async function createWorkspace(userId: string, name: string) {
  const workspace = await WorkspaceModel.create({
    name,
    invite: { code: await uniqueInviteCode() },
    members: [{ userId, role: "admin" }],
  });

  return toUserWorkspace(workspace, "admin");
}

export async function joinWorkspace(userId: string, code: string) {
  const workspace = await WorkspaceModel.findOne({ "invite.code": code });

  if (!workspace) throw new HttpError(404, "Invalid invite code");

  if (!workspace.invite.enabled) throw new HttpError(403, "Invite code is disabled");

  if (workspace.members.some((m) => m.userId.equals(userId))) {
    throw new HttpError(409, "You are already a member of this workspace");
  }

  workspace.members.push({ userId, role: "member" });
  await workspace.save();

  return toUserWorkspace(workspace, "member");
}

export async function updateWorkspaceName(workspace: Workspace, role: WorkspaceRole, name: string) {
  workspace.name = name;
  await workspace.save();

  return toUserWorkspace(workspace, role);
}

export async function updateDefaultSemester(
  workspace: Workspace,
  role: WorkspaceRole,
  semester: number,
) {
  workspace.defaultSemester = semester;
  await workspace.save();

  return toUserWorkspace(workspace, role);
}

export async function deleteWorkspace(workspace: Workspace) {
  await deleteSubjects({ workspaceId: workspace._id });
  await removeUploads(workspace._id);
  await workspace.deleteOne();
}

export function getCode(workspace: Workspace) {
  return toCode(workspace);
}

export async function renewCode(workspace: Workspace) {
  workspace.invite.code = await uniqueInviteCode();
  workspace.invite.updatedAt = new Date();
  await workspace.save();

  return toCode(workspace);
}

export async function updateCodeStatus(workspace: Workspace, enabled: boolean) {
  workspace.invite.enabled = enabled;
  await workspace.save();

  return toCode(workspace);
}

export async function getMembers(workspace: Workspace) {
  const { members } = workspace;
  const users = await UserModel.find({ _id: { $in: members.map((m) => m.userId) } });

  return users.map((user) => ({
    workspaceId: workspace.id,
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: members.find((m) => m.userId.equals(user._id))!.role,
  }));
}

// admin only: promoting someone to admin hands the role over and demotes the caller
export async function updateMemberRole(
  workspace: Workspace,
  userId: string,
  targetUserId: string,
  role: WorkspaceRole,
) {
  const { members } = workspace;

  if (targetUserId === userId) throw new HttpError(400, "You can't change your own role");

  const target = members.find((m) => m.userId.equals(targetUserId));

  if (!target) throw new HttpError(404, "Member not found");

  target.role = role;
  if (role === "admin") members.find((m) => m.userId.equals(userId))!.role = "co-admin";
  await workspace.save();
}

// leaving yourself, or kicking: admin kicks anyone, co-admin kicks members only
export async function deleteMember(
  workspace: Workspace,
  userId: string,
  role: WorkspaceRole,
  targetUserId: string,
) {
  const target = workspace.members.find((m) => m.userId.equals(targetUserId));

  if (!target) throw new HttpError(404, "Member not found");

  if (target.userId.equals(userId)) {
    if (role === "admin") throw new HttpError(400, "Transfer the admin role before leaving");
  } else if (!(role === "admin" || (role === "co-admin" && target.role === "member"))) {
    throw new HttpError(403, "You don't have permission to do this");
  }

  await WorkspaceModel.updateOne(
    { _id: workspace._id },
    { $pull: { members: { userId: target.userId } } },
  );
}
