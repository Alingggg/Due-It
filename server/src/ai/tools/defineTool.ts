import * as z from "zod";
import type { WorkspaceRole } from "../../models/index.ts";
import { workspaceService } from "../../services/index.ts";
import type { ToolContext } from "../../types/index.ts";
import { HttpError } from "../../utils/index.ts";

// every tool works on one workspace, picked by the model from the system prompt's list
const workspaceArg = z.object({
  workspaceId: z.string().describe("Id of the workspace, from the list in the system prompt"),
});

export function defineTool<T extends z.ZodObject>(tool: {
  name: string;
  description: string;
  // same rule as the matching route's requireRole; "any" = every workspace member
  roles: WorkspaceRole[] | "any";
  args: T;
  run: (args: z.infer<T>, ctx: ToolContext) => Promise<Record<string, unknown>>;
}) {
  return {
    name: tool.name,
    description: tool.description,
    args: tool.args.extend(workspaceArg.shape),
    run: async (rawArgs: unknown, userId: string) => {
      const { workspaceId } = workspaceArg.parse(rawArgs);

      // the model only names the workspace; membership and role are checked here,
      // before the other args, so a forbidden call isn't retried with fixed args
      const { workspace, role } = await workspaceService.getMembership(workspaceId, userId);

      if (tool.roles !== "any" && !tool.roles.includes(role)) {
        throw new HttpError(403, "You don't have permission to do this");
      }

      const validArgs = tool.args.parse(rawArgs);
      return tool.run(validArgs, { userId, workspace, role });
    },
  };
}
