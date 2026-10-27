import * as z from "zod";
import { defineTool } from "./defineTool.ts";
import { ADMIN_ROLES } from "../../models/index.ts";
import { workspaceService } from "../../services/index.ts";
import {
  codeStatusSchema,
  defaultSemesterSchema,
  workspaceNameSchema,
} from "../../zod-schema/index.ts";

export const getMembers = defineTool({
  name: "get_members",
  description:
    "List the workspace's members with their names, emails and roles (admin, co-admin, member).",
  roles: "any",
  args: z.object({}),
  async run(_args, ctx) {
    return { members: await workspaceService.getMembers(ctx.workspace) };
  },
});

export const getInviteCode = defineTool({
  name: "get_invite_code",
  description: "Get the code others use to join the workspace, and whether joining is enabled.",
  roles: "any",
  args: z.object({}),
  async run(_args, ctx) {
    return workspaceService.getCode(ctx.workspace);
  },
});

export const renameWorkspace = defineTool({
  name: "rename_workspace",
  description: "Rename the workspace.",
  roles: ADMIN_ROLES,
  args: z.object({ name: z.string().describe("New workspace name") }),
  async run(args, ctx) {
    const { name } = workspaceNameSchema.parse(args);

    return workspaceService.updateWorkspaceName(ctx.workspace, ctx.role, name);
  },
});

export const setDefaultSemester = defineTool({
  name: "set_default_semester",
  description: "Set which semester the workspace shows by default.",
  roles: ADMIN_ROLES,
  args: z.object({ semester: z.number().int().describe("1 or 2") }),
  async run(args, ctx) {
    const { semester } = defaultSemesterSchema.parse(args);

    return workspaceService.updateDefaultSemester(ctx.workspace, ctx.role, semester);
  },
});

export const setInviteCodeEnabled = defineTool({
  name: "set_invite_code_enabled",
  description: "Turn joining with the invite code on or off.",
  roles: ADMIN_ROLES,
  args: z.object({ enabled: z.boolean().describe("true = people can join with the code") }),
  async run(args, ctx) {
    const { enabled } = codeStatusSchema.parse(args);

    return workspaceService.updateCodeStatus(ctx.workspace, enabled);
  },
});
