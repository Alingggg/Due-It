import * as z from "zod";

const WorkspaceNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Workspace name is required" })
    .max(100, { error: "Workspace name is too long" }),
});

export { WorkspaceNameSchema };
