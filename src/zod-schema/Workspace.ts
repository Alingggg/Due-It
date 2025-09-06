import * as z from "zod";

const workspaceSchema = z.object({
  workspaceName: z
    .string({ error: "Workspace name is required" })
    .transform((val) => val.trim())
    .refine((val) => val.length >= 3, {
      error: "Workspace name must be at least 3 characters",
    })
    .refine((val) => val.length <= 50, { error: "Workspace name is too long" }),
});

export { workspaceSchema };
