import type { Request, Response } from "express";
import { subjectService } from "../services/index.ts";
import { scheduleSchema, semesterQuerySchema, subjectSchema } from "../zod-schema/index.ts";

export async function getSubjects(req: Request, res: Response) {
  const { semester } = semesterQuerySchema.parse(req.query);

  res.json(await subjectService.getSubjects(req.workspace._id, semester));
}

export async function createSubject(req: Request, res: Response) {
  const data = subjectSchema.parse(req.body);

  res.status(201).json(await subjectService.createSubject(req.workspace._id, data));
}

export async function updateSubject(req: Request, res: Response) {
  const data = subjectSchema.parse(req.body);

  res.json(await subjectService.updateSubject(req.workspace._id, String(req.params.id), data));
}

// also deletes the subject's tasks, material groups and their files
export async function deleteSubject(req: Request, res: Response) {
  await subjectService.deleteSubject(req.workspace._id, String(req.params.id));

  res.status(204).end();
}

export async function getSchedules(req: Request, res: Response) {
  const { semester } = semesterQuerySchema.parse(req.query);

  res.json(await subjectService.getSchedules(req.workspace._id, semester));
}

export async function createSchedule(req: Request, res: Response) {
  const { subjectId, ...data } = scheduleSchema.parse(req.body);

  res.status(201).json(await subjectService.createSchedule(req.workspace._id, subjectId, data));
}

export async function updateSchedule(req: Request, res: Response) {
  const { subjectId, ...data } = scheduleSchema.parse(req.body);

  await subjectService.updateSchedule(req.workspace._id, String(req.params.id), subjectId, data);

  res.status(204).end();
}

export async function deleteSchedule(req: Request, res: Response) {
  await subjectService.deleteSchedule(req.workspace._id, String(req.params.id));

  res.status(204).end();
}
