import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  setTaskCompletion,
  updateTask,
} from "../controllers/index.ts";
import { requireRole } from "../middleware/index.ts";

// mounted by workspaceRouter under /:workspaceId, after requireAuth + requireMember
export const taskRouter = Router();

const editor = requireRole("admin", "co-admin");

taskRouter.get("/tasks", getTasks);
taskRouter.get("/tasks/:id", getTask);
taskRouter.post("/tasks", editor, createTask);
taskRouter.patch("/tasks/:id", editor, updateTask);
taskRouter.delete("/tasks/:id", editor, deleteTask);
taskRouter.put("/tasks/:id/completion", setTaskCompletion);
