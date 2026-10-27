import * as z from "zod";
import { workspaceService } from "../../services/index.ts";
import { HttpError } from "../../utils/index.ts";
import { getMaterialGroup, getMaterialGroups } from "./materials.ts";
import {
  createSchedule,
  createSubject,
  getSchedules,
  getSubjects,
  updateSchedule,
  updateSubject,
} from "./subjects.ts";
import { createTask, getTask, getTasks, setTaskCompletion, updateTask } from "./tasks.ts";
import { workspaceArg, workspacesArg } from "./workspaceArgs.ts";
import {
  getInviteCode,
  getMembers,
  renameWorkspace,
  setDefaultSemester,
  setInviteCodeEnabled,
} from "./workspaces.ts";

const tools = [
  getTasks,
  getTask,
  createTask,
  updateTask,
  setTaskCompletion,
  getSubjects,
  createSubject,
  updateSubject,
  getSchedules,
  createSchedule,
  updateSchedule,
  getMaterialGroups,
  getMaterialGroup,
  getMembers,
  getInviteCode,
  renameWorkspace,
  setDefaultSemester,
  setInviteCodeEnabled,
];

type Tool = (typeof tools)[number];

const workspaceSchema = z.object(workspaceArg);
const workspacesSchema = z.object(workspacesArg);

export const geminiTools = [
  {
    functionDeclarations: tools.map((tool) => {
      const { $schema, ...parameters } = z.toJSONSchema(tool.args);
      return {
        name: tool.name,
        description: tool.description,
        parametersJsonSchema: parameters,
      };
    }),
  },
];

async function runInWorkspace(tool: Tool, rawArgs: unknown, userId: string, workspaceId: string) {
  // checked before the tool's own args so the model doesn't retry a forbidden call with fixed args
  const { workspace, role } = await workspaceService.getMembership(workspaceId, userId);

  if (tool.roles !== "any" && !tool.roles.includes(role)) {
    throw new HttpError(403, "You don't have permission to do this");
  }

  return tool.run(rawArgs, { userId, workspace, role });
}

export async function runTool(name: string, rawArgs: unknown, userId: string) {
  const tool = tools.find((t) => t.name === name);
  if (!tool) return { error: `Unknown tool: ${name}` };

  try {
    if (!("workspaceIds" in tool.args.shape)) {
      const { workspaceId } = workspaceSchema.parse(rawArgs);
      return await runInWorkspace(tool, rawArgs, userId, workspaceId);
    }

    const { workspaceIds } = workspacesSchema.parse(rawArgs);
    const results = await Promise.all(
      workspaceIds.map(async (workspaceId) => {
        try {
          return { workspaceId, ...(await runInWorkspace(tool, rawArgs, userId, workspaceId)) };
        } catch (error) {
          if (error instanceof HttpError) return { workspaceId, error: error.message };
          throw error;
        }
      }),
    );

    return { results };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: `Invalid arguments: ${z.prettifyError(error)}` };
    }
    if (error instanceof HttpError) return { error: error.message };

    console.error(`Tool ${name} failed:`, error);
    return { error: "The tool failed to run." };
  }
}
