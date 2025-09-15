import * as z from "zod";

const workspaceSchema = z.object({
  workspaceName: z
    .string()
    .trim()
    .min(1, { error: "Workspace name is required" })
    .max(100, { error: "Workspace name is too long" }),
});

const WorkspaceNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Workspace name is required" })
    .max(100, { error: "Workspace name is too long" }),
});

export { workspaceSchema, WorkspaceNameSchema };
