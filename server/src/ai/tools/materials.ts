import * as z from "zod";
import { defineTool } from "./defineTool.ts";
import { materialService } from "../../services/index.ts";

export const getMaterialGroups = defineTool({
  name: "get_material_groups",
  description:
    "List the workspace's learning material groups for a semester, newest first. " +
    "Each group holds files and links shared for a subject.",
  roles: "any",
  args: z.object({
    semester: z
      .number()
      .int()
      .optional()
      .describe("Semester number. Leave out to use the workspace's default semester"),
  }),
  async run({ semester }, ctx) {
    return {
      materialGroups: await materialService.getMaterialGroups(
        ctx.workspace._id,
        semester ?? ctx.workspace.defaultSemester,
      ),
    };
  },
});

export const getMaterialGroup = defineTool({
  name: "get_material_group",
  description:
    "Get one material group with its materials. For links, url is the link itself; " +
    "for uploaded files, url is an internal storage path, not something to share.",
  roles: "any",
  args: z.object({
    groupId: z.string().describe("Id of the material group, from get_material_groups"),
  }),
  async run({ groupId }, ctx) {
    return materialService.getMaterialGroup(ctx.workspace._id, groupId);
  },
});
