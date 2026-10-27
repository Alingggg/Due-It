import type { Request, Response } from "express";
import { taskService } from "../services/index.ts";
import { taskCompletionSchema, taskSchema, tasksQuerySchema } from "../zod-schema/index.ts";

export async function getTasks(req: Request, res: Response) {
  const query = tasksQuerySchema.parse(req.query);

  res.json(await taskService.getTasks(req.workspace._id, req.userId, query));
}

export async function getTask(req: Request, res: Response) {
  res.json(await taskService.getTask(req.workspace._id, req.userId, String(req.params.id)));
}

export async function createTask(req: Request, res: Response) {
  const data = taskSchema.parse(req.body);

  res.status(201).json(await taskService.createTask(req.workspace._id, data));
}

export async function updateTask(req: Request, res: Response) {
  const data = taskSchema.parse(req.body);

  res.json(await taskService.updateTask(req.workspace._id, String(req.params.id), data));
}

export async function deleteTask(req: Request, res: Response) {
  await taskService.deleteTask(req.workspace._id, String(req.params.id));

  res.status(204).end();
}

export async function setTaskCompletion(req: Request, res: Response) {
  const { done } = taskCompletionSchema.parse(req.body);

  await taskService.setTaskCompletion(req.workspace._id, req.userId, String(req.params.id), done);

  res.status(204).end();
}
