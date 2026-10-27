import type { Types } from "mongoose";
import { SubjectModel, TaskModel } from "../models/index.ts";
import type { TaskInput, TasksQuery } from "../types/index.ts";
import { HttpError } from "../utils/index.ts";

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

async function assertSubjectExists(subjectId: string, workspaceId: Types.ObjectId) {
  if (!(await SubjectModel.exists({ _id: subjectId, workspaceId }))) {
    throw new HttpError(404, "Subject not found");
  }
}

export async function getTasks(
  workspaceId: Types.ObjectId,
  userId: string,
  { semester, dueFrom, dueTo, completed }: TasksQuery,
) {
  const subjects = await SubjectModel.find({ workspaceId, semester });

  const tasks = await TaskModel.find({
    subjectId: { $in: subjects.map((s) => s._id) },
    ...((dueFrom || dueTo) && {
      dueDate: { ...(dueFrom && { $gte: dueFrom }), ...(dueTo && { $lte: dueTo }) },
    }),
    ...(completed && {
      completedBy: completed === "true" ? userId : { $ne: userId },
    }),
  }).sort({ dueDate: 1, dueTime: 1 });

  return tasks.map((task) => {
    const subject = subjects.find((s) => s._id.equals(task.subjectId))!;
    return toSemesterTask(task, subject, userId);
  });
}

export async function getTask(workspaceId: Types.ObjectId, userId: string, taskId: string) {
  const task = await TaskModel.findOne({ _id: taskId, workspaceId });
  const subject = task && (await SubjectModel.findById(task.subjectId));

  if (!task || !subject) throw new HttpError(404, "Task not found");

  return toSemesterTask(task, subject, userId);
}

export async function createTask(workspaceId: Types.ObjectId, data: TaskInput) {
  await assertSubjectExists(data.subjectId, workspaceId);

  return TaskModel.create({ ...data, workspaceId });
}

export async function updateTask(workspaceId: Types.ObjectId, taskId: string, data: TaskInput) {
  await assertSubjectExists(data.subjectId, workspaceId);

  const task = await TaskModel.findOneAndUpdate({ _id: taskId, workspaceId }, data, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!task) throw new HttpError(404, "Task not found");

  return task;
}

export async function deleteTask(workspaceId: Types.ObjectId, taskId: string) {
  const { deletedCount } = await TaskModel.deleteOne({ _id: taskId, workspaceId });

  if (!deletedCount) throw new HttpError(404, "Task not found");
}

export async function setTaskCompletion(
  workspaceId: Types.ObjectId,
  userId: string,
  taskId: string,
  done: boolean,
) {
  const { matchedCount } = await TaskModel.updateOne(
    { _id: taskId, workspaceId },
    done ? { $addToSet: { completedBy: userId } } : { $pull: { completedBy: userId } },
  );

  if (!matchedCount) throw new HttpError(404, "Task not found");
}
