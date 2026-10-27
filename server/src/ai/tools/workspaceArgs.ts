import * as z from "zod";

export const workspaceArg = {
  workspaceId: z.string().describe("Id of the workspace, from the list in the system prompt"),
};

export const workspacesArg = {
  workspaceIds: z
    .array(z.string())
    .min(1)
    .describe(
      "Ids of the workspaces to look in, from the list in the system prompt. " +
        "Pass every id to look in all of them",
    ),
};
