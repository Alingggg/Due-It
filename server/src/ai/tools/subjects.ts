import * as z from "zod";
import { defineTool } from "./defineTool.ts";
import { workspaceArg, workspacesArg } from "./workspaceArgs.ts";
import { EDITOR_ROLES } from "../../models/index.ts";
import { subjectService } from "../../services/index.ts";
import { scheduleSchema, subjectSchema } from "../../zod-schema/index.ts";

const semesterArg = z
  .number()
  .int()
  .optional()
  .describe("Semester number. Leave out to use each workspace's default semester");

const subjectArgs = {
  name: z.string().describe("Subject name, e.g. Data Structures"),
  subjectCode: z.string().describe("Short course code, e.g. CS 211"),
  instructorName: z.string().describe("Name of the instructor"),
  semester: z.number().int().describe("Semester the subject is taken in"),
};

const scheduleArgs = {
  subjectId: z.string().describe("Id of the subject the class belongs to, from get_subjects"),
  dayOfWeek: z
    .enum(["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"])
    .describe("Day the class meets"),
  startTime: z.string().describe("Start time, 24-hour HH:MM"),
  endTime: z.string().describe("End time, 24-hour HH:MM"),
};

export const getSubjects = defineTool({
  name: "get_subjects",
  description:
    "List subjects for a semester in one or more workspaces, including their class schedules.",
  roles: "any",
  args: z.object({ ...workspacesArg, semester: semesterArg }),
  async run({ semester }, ctx) {
    const subjects = await subjectService.getSubjects(
      ctx.workspace._id,
      semester ?? ctx.workspace.defaultSemester,
    );

    return { subjects: subjects.map((subject) => subject.toJSON()) };
  },
});

export const createSubject = defineTool({
  name: "create_subject",
  description: "Create a subject in the workspace.",
  roles: EDITOR_ROLES,
  args: z.object({ ...workspaceArg, ...subjectArgs }),
  async run(args, ctx) {
    const data = subjectSchema.parse(args);
    const subject = await subjectService.createSubject(ctx.workspace._id, data);

    return { subject: subject.toJSON() };
  },
});

export const updateSubject = defineTool({
  name: "update_subject",
  description:
    "Replace a subject's details. Every field is overwritten, so call get_subjects first " +
    "and send the current values for the fields that aren't changing.",
  roles: EDITOR_ROLES,
  args: z.object({
    ...workspaceArg,
    subjectId: z.string().describe("Id of the subject, from get_subjects"),
    ...subjectArgs,
  }),
  async run({ subjectId, ...data }, ctx) {
    const subject = await subjectService.updateSubject(
      ctx.workspace._id,
      subjectId,
      subjectSchema.parse(data),
    );

    return { subject: subject.toJSON() };
  },
});

export const getSchedules = defineTool({
  name: "get_schedules",
  description:
    "List the weekly class schedule for a semester in one or more workspaces, " +
    "one entry per class meeting.",
  roles: "any",
  args: z.object({ ...workspacesArg, semester: semesterArg }),
  async run({ semester }, ctx) {
    return {
      schedules: await subjectService.getSchedules(
        ctx.workspace._id,
        semester ?? ctx.workspace.defaultSemester,
      ),
    };
  },
});

export const createSchedule = defineTool({
  name: "create_schedule",
  description: "Add a weekly class meeting to a subject.",
  roles: EDITOR_ROLES,
  args: z.object({ ...workspaceArg, ...scheduleArgs }),
  async run(args, ctx) {
    const { subjectId, ...data } = scheduleSchema.parse(args);
    const schedule = await subjectService.createSchedule(ctx.workspace._id, subjectId, data);

    return { schedule: schedule?.toJSON() };
  },
});

export const updateSchedule = defineTool({
  name: "update_schedule",
  description:
    "Replace a class meeting's details. Changing subjectId moves it to another subject. " +
    "Every field is overwritten, so call get_schedules first and send the current values " +
    "for the fields that aren't changing.",
  roles: EDITOR_ROLES,
  args: z.object({
    ...workspaceArg,
    scheduleId: z.string().describe("Id of the class meeting, from get_schedules"),
    ...scheduleArgs,
  }),
  async run({ scheduleId, ...rest }, ctx) {
    const { subjectId, ...data } = scheduleSchema.parse(rest);
    await subjectService.updateSchedule(ctx.workspace._id, scheduleId, subjectId, data);

    return { success: true };
  },
});
