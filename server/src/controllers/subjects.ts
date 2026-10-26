import type { Request, Response } from "express";
import { SubjectModel } from "../models/index.ts";
import { scheduleSchema, semesterQuerySchema, subjectSchema } from "../zod-schema/index.ts";
import { deleteSubjects } from "../utils/index.ts";

export async function getSubjects(req: Request, res: Response) {
  const { semester } = semesterQuerySchema.parse(req.query);

  const subjects = await SubjectModel.find({ workspaceId: req.workspace._id, semester });

  res.json(subjects);
}

export async function createSubject(req: Request, res: Response) {
  const data = subjectSchema.parse(req.body);

  const subject = await SubjectModel.create({ ...data, workspaceId: req.workspace._id });

  res.status(201).json(subject);
}

export async function updateSubject(req: Request, res: Response) {
  const data = subjectSchema.parse(req.body);

  const subject = await SubjectModel.findOneAndUpdate(
    { _id: req.params.id, workspaceId: req.workspace._id },
    data,
    { returnDocument: "after", runValidators: true },
  );

  if (!subject) {
    res.status(404).json({ message: "Subject not found" });
    return;
  }

  res.json(subject);
}

// also deletes the subject's tasks, material groups and their files
export async function deleteSubject(req: Request, res: Response) {
  const filter = { _id: String(req.params.id), workspaceId: req.workspace._id };

  if (!(await SubjectModel.exists(filter))) {
    res.status(404).json({ message: "Subject not found" });
    return;
  }

  await deleteSubjects(filter);

  res.status(204).end();
}

export async function getSchedules(req: Request, res: Response) {
  const { semester } = semesterQuerySchema.parse(req.query);

  const subjects = await SubjectModel.find({ workspaceId: req.workspace._id, semester });

  res.json(
    subjects.flatMap((subject) =>
      subject.schedules.map((schedule) => ({
        id: schedule._id,
        subjectId: subject.id,
        semester: subject.semester,
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        subjectName: subject.name,
      })),
    ),
  );
}

export async function createSchedule(req: Request, res: Response) {
  const { subjectId, ...data } = scheduleSchema.parse(req.body);

  const subject = await SubjectModel.findOne({ _id: subjectId, workspaceId: req.workspace._id });

  if (!subject) {
    res.status(404).json({ message: "Subject not found" });
    return;
  }

  subject.schedules.push(data);
  await subject.save();

  res.status(201).json(subject.schedules.at(-1));
}

export async function updateSchedule(req: Request, res: Response) {
  const { subjectId, ...data } = scheduleSchema.parse(req.body);
  const scheduleId = String(req.params.id);

  const subject = await SubjectModel.findOne({
    "schedules._id": scheduleId,
    workspaceId: req.workspace._id,
  });
  const schedule = subject?.schedules.id(scheduleId);

  if (!subject || !schedule) {
    res.status(404).json({ message: "Schedule not found" });
    return;
  }

  if (subject.id === subjectId) {
    schedule.set(data);
    await subject.save();
    res.status(204).end();
    return;
  }

  // moved to another subject
  const target = await SubjectModel.findOne({ _id: subjectId, workspaceId: req.workspace._id });

  if (!target) {
    res.status(404).json({ message: "Subject not found" });
    return;
  }

  schedule.deleteOne();
  target.schedules.push({ _id: schedule._id, ...data });
  await subject.save();
  await target.save();

  res.status(204).end();
}

export async function deleteSchedule(req: Request, res: Response) {
  const scheduleId = String(req.params.id);

  const { matchedCount } = await SubjectModel.updateOne(
    { "schedules._id": scheduleId, workspaceId: req.workspace._id },
    { $pull: { schedules: { _id: scheduleId } } },
  );

  if (!matchedCount) {
    res.status(404).json({ message: "Schedule not found" });
    return;
  }

  res.status(204).end();
}
