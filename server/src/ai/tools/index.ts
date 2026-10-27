import * as z from "zod";
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

// errors go back to the model as { error } so it can tell the user or retry
export async function runTool(name: string, rawArgs: unknown, userId: string) {
  const tool = tools.find((t) => t.name === name);
  if (!tool) return { error: `Unknown tool: ${name}` };

  try {
    return await tool.run(rawArgs, userId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: `Invalid arguments: ${z.prettifyError(error)}` };
    }
    if (error instanceof HttpError) return { error: error.message };

    console.error(`Tool ${name} failed:`, error);
    return { error: "The tool failed to run." };
  }
}
