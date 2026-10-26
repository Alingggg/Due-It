import type { Request, Response } from "express";
import type { Types } from "mongoose";
import { SubjectModel, TaskModel } from "../models/index.ts";
import { taskCompletionSchema, taskSchema, tasksQuerySchema } from "../zod-schema/index.ts";

type Task = InstanceType<typeof TaskModel>;
type Subject = { id: string; name: string; semester: number };

// same shape the client got from the old semester_tasks view
function toSemesterTask(task: Task, subject: Subject, userId: string) {
  return {
    id: task.id,
    subjectId: subject.id,
    title: task.title,
    description: task.description,
    completionType: task.completionType,
    taskType: task.taskType,
    dueDate: task.dueDate.toISOString().slice(0, 10),
    dueTime: task.dueTime,
    semester: subject.semester,
    subjectName: subject.name,
    isCompleted: task.completedBy.some((id) => id.equals(userId)),
  };
}

function subjectExists(subjectId: string, workspaceId: Types.ObjectId) {
  return SubjectModel.exists({ _id: subjectId, workspaceId });
}

export async function getTasks(req: Request, res: Response) {
  const { semester, dueFrom, dueTo, completed } = tasksQuerySchema.parse(req.query);

  const subjects = await SubjectModel.find({ workspaceId: req.workspace._id, semester });

  const tasks = await TaskModel.find({
    subjectId: { $in: subjects.map((s) => s._id) },
    ...((dueFrom || dueTo) && {
      dueDate: { ...(dueFrom && { $gte: dueFrom }), ...(dueTo && { $lte: dueTo }) },
    }),
    ...(completed && {
      completedBy: completed === "true" ? req.userId : { $ne: req.userId },
    }),
  }).sort({ dueDate: 1, dueTime: 1 });

  res.json(
    tasks.map((task) => {
      const subject = subjects.find((s) => s._id.equals(task.subjectId))!;
      return toSemesterTask(task, subject, req.userId);
    }),
  );
}

export async function getTask(req: Request, res: Response) {
  const task = await TaskModel.findOne({ _id: req.params.id, workspaceId: req.workspace._id });
  const subject = task && (await SubjectModel.findById(task.subjectId));

  if (!task || !subject) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.json(toSemesterTask(task, subject, req.userId));
}

export async function createTask(req: Request, res: Response) {
  const data = taskSchema.parse(req.body);

  if (!(await subjectExists(data.subjectId, req.workspace._id))) {
    res.status(404).json({ message: "Subject not found" });
    return;
  }

  const task = await TaskModel.create({ ...data, workspaceId: req.workspace._id });

  res.status(201).json(task);
}

export async function updateTask(req: Request, res: Response) {
  const data = taskSchema.parse(req.body);

  if (!(await subjectExists(data.subjectId, req.workspace._id))) {
    res.status(404).json({ message: "Subject not found" });
    return;
  }

  const task = await TaskModel.findOneAndUpdate(
    { _id: req.params.id, workspaceId: req.workspace._id },
    data,
    { returnDocument: "after", runValidators: true },
  );

  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.json(task);
}

export async function deleteTask(req: Request, res: Response) {
  const { deletedCount } = await TaskModel.deleteOne({
    _id: req.params.id,
    workspaceId: req.workspace._id,
  });

  if (!deletedCount) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.status(204).end();
}

// marks the task done / not done for the signed-in user only
export async function setTaskCompletion(req: Request, res: Response) {
  const { done } = taskCompletionSchema.parse(req.body);

  const { matchedCount } = await TaskModel.updateOne(
    { _id: req.params.id, workspaceId: req.workspace._id },
    done
      ? { $addToSet: { completedBy: req.userId } }
      : { $pull: { completedBy: req.userId } },
  );

  if (!matchedCount) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.status(204).end();
}
