import type { Types } from "mongoose";
import { SubjectModel } from "../models/index.ts";
import type { ScheduleInput, SubjectInput } from "../types/index.ts";
import { HttpError, deleteSubjects } from "../utils/index.ts";

type ScheduleData = Omit<ScheduleInput, "subjectId">;

export function getSubjects(workspaceId: Types.ObjectId, semester: number) {
  return SubjectModel.find({ workspaceId, semester });
}

export function createSubject(workspaceId: Types.ObjectId, data: SubjectInput) {
  return SubjectModel.create({ ...data, workspaceId });
}

export async function updateSubject(
  workspaceId: Types.ObjectId,
  subjectId: string,
  data: SubjectInput,
) {
  const subject = await SubjectModel.findOneAndUpdate({ _id: subjectId, workspaceId }, data, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!subject) throw new HttpError(404, "Subject not found");

  return subject;
}

// also deletes the subject's tasks, material groups and their files
export async function deleteSubject(workspaceId: Types.ObjectId, subjectId: string) {
  const filter = { _id: subjectId, workspaceId };

  if (!(await SubjectModel.exists(filter))) throw new HttpError(404, "Subject not found");

  await deleteSubjects(filter);
}

export async function getSchedules(workspaceId: Types.ObjectId, semester: number) {
  const subjects = await SubjectModel.find({ workspaceId, semester });

  return subjects.flatMap((subject) =>
    subject.schedules.map((schedule) => ({
      id: schedule._id,
      subjectId: subject.id,
      semester: subject.semester,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      subjectName: subject.name,
    })),
  );
}

async function findSubject(workspaceId: Types.ObjectId, subjectId: string) {
  const subject = await SubjectModel.findOne({ _id: subjectId, workspaceId });

  if (!subject) throw new HttpError(404, "Subject not found");

  return subject;
}

export async function createSchedule(
  workspaceId: Types.ObjectId,
  subjectId: string,
  data: ScheduleData,
) {
  const subject = await findSubject(workspaceId, subjectId);

  subject.schedules.push(data);
  await subject.save();

  return subject.schedules.at(-1);
}

export async function updateSchedule(
  workspaceId: Types.ObjectId,
  scheduleId: string,
  subjectId: string,
  data: ScheduleData,
) {
  const subject = await SubjectModel.findOne({ "schedules._id": scheduleId, workspaceId });
  const schedule = subject?.schedules.id(scheduleId);

  if (!subject || !schedule) throw new HttpError(404, "Schedule not found");

  if (subject.id === subjectId) {
    schedule.set(data);
    await subject.save();
    return;
  }

  // moved to another subject
  const target = await findSubject(workspaceId, subjectId);

  schedule.deleteOne();
  target.schedules.push({ _id: schedule._id, ...data });
  await subject.save();
  await target.save();
}

export async function deleteSchedule(workspaceId: Types.ObjectId, scheduleId: string) {
  const { matchedCount } = await SubjectModel.updateOne(
    { "schedules._id": scheduleId, workspaceId },
    { $pull: { schedules: { _id: scheduleId } } },
  );

  if (!matchedCount) throw new HttpError(404, "Schedule not found");
}
