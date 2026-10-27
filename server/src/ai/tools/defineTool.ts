import type * as z from "zod";
import type { WorkspaceRole } from "../../models/index.ts";
import type { ToolContext } from "../../types/index.ts";
import type { workspaceArg, workspacesArg } from "./workspaceArgs.ts";

// args must include workspaceArg or workspacesArg so runTool can check membership
type ToolShape = z.core.$ZodShape & (typeof workspaceArg | typeof workspacesArg);

export function defineTool<S extends ToolShape>(tool: {
  name: string;
  description: string;
  roles: WorkspaceRole[] | "any";
  args: z.ZodObject<S>;
  run: (args: z.infer<z.ZodObject<S>>, ctx: ToolContext) => Promise<Record<string, unknown>>;
}) {
  return {
    ...tool,
    run: (rawArgs: unknown, ctx: ToolContext) => tool.run(tool.args.parse(rawArgs), ctx),
  };
}
