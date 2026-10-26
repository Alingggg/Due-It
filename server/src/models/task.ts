import { Schema, model } from "mongoose";
import { timeOfDay } from "./common.ts";

const TASK_TYPES = ["activity", "exam"] as const;

const COMPLETION_TYPES = ["individual", "pair", "group"] as const;

const taskSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, required: true },
    subjectId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    description: { type: String, default: null },
    taskType: { type: String, enum: TASK_TYPES, required: true },
    completionType: { type: String, enum: COMPLETION_TYPES, required: true },
    dueDate: { type: Date, required: true },
    dueTime: timeOfDay,
    completedBy: { type: [Schema.Types.ObjectId], default: [] },
  },
  { collection: "tasks" },
);

taskSchema.index({ subjectId: 1, dueDate: 1 });
taskSchema.index({ workspaceId: 1 });

export const TaskModel = model("Task", taskSchema);
