import * as z from "zod";
import { defineTool } from "./defineTool.ts";
import { workspaceArg, workspacesArg } from "./workspaceArgs.ts";
import { EDITOR_ROLES } from "../../models/index.ts";
import { taskService } from "../../services/index.ts";
import { taskSchema, tasksQuerySchema } from "../../zod-schema/index.ts";

const taskArgs = {
  subjectId: z.string().describe("Id of the subject the task belongs to, from get_subjects"),
  title: z.string().describe("Short title of the task"),
  description: z.string().nullish().describe("Optional details about the task"),
  taskType: z
    .enum(["activity", "exam"])
    .describe("activity = assignments, projects and other work; exam = quizzes and exams"),
  completionType: z
    .enum(["individual", "pair", "group"])
    .describe("Whether the task is done alone, in pairs or as a group"),
  dueDate: z.string().describe("Due date, YYYY-MM-DD"),
  dueTime: z.string().describe("Due time, 24-hour HH:MM"),
};

export const getTasks = defineTool({
  name: "get_tasks",
  description:
    "List tasks for a semester in one or more workspaces, sorted by due date. " +
    "isCompleted tells whether the current user has marked the task as done.",
  roles: "any",
  args: z.object({
    ...workspacesArg,
    semester: z
      .number()
      .int()
      .optional()
      .describe("Semester number. Leave out to use each workspace's default semester"),
    dueFrom: z.string().optional().describe("Only tasks due on or after this date, YYYY-MM-DD"),
    dueTo: z.string().optional().describe("Only tasks due on or before this date, YYYY-MM-DD"),
    completed: z
      .boolean()
      .optional()
      .describe("true = only tasks the user finished, false = only unfinished. Leave out for both"),
  }),
  async run({ semester, dueFrom, dueTo, completed }, ctx) {
    const query = tasksQuerySchema.parse({
      semester: semester ?? ctx.workspace.defaultSemester,
      dueFrom,
      dueTo,
      completed: completed?.toString(),
    });

    return { tasks: await taskService.getTasks(ctx.workspace._id, ctx.userId, query) };
  },
});

export const getTask = defineTool({
  name: "get_task",
  description: "Get one task by id.",
  roles: "any",
  args: z.object({
    ...workspaceArg,
    taskId: z.string().describe("Id of the task, from get_tasks"),
  }),
  async run({ taskId }, ctx) {
    return taskService.getTask(ctx.workspace._id, ctx.userId, taskId);
  },
});

export const createTask = defineTool({
  name: "create_task",
  description: "Create a task under a subject. The task is shared with the whole workspace.",
  roles: EDITOR_ROLES,
  args: z.object({ ...workspaceArg, ...taskArgs }),
  async run(args, ctx) {
    const task = await taskService.createTask(ctx.workspace._id, taskSchema.parse(args));

    return { task: task.toJSON() };
  },
});

export const updateTask = defineTool({
  name: "update_task",
  description:
    "Replace a task's details. Every field is overwritten, so call get_task first " +
    "and send the current values for the fields that aren't changing.",
  roles: EDITOR_ROLES,
  args: z.object({
    ...workspaceArg,
    taskId: z.string().describe("Id of the task, from get_tasks"),
    ...taskArgs,
  }),
  async run({ taskId, ...data }, ctx) {
    const task = await taskService.updateTask(ctx.workspace._id, taskId, taskSchema.parse(data));

    return { task: task.toJSON() };
  },
});

export const setTaskCompletion = defineTool({
  name: "set_task_completion",
  description: "Mark a task as done or not done for the current user only.",
  roles: "any",
  args: z.object({
    ...workspaceArg,
    taskId: z.string().describe("Id of the task, from get_tasks"),
    done: z.boolean().describe("true = done, false = not done"),
  }),
  async run({ taskId, done }, ctx) {
    await taskService.setTaskCompletion(ctx.workspace._id, ctx.userId, taskId, done);

    return { success: true };
  },
});
