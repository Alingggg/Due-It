import { Router } from "express";
import {
  createSchedule,
  createSubject,
  deleteSchedule,
  deleteSubject,
  getSchedules,
  getSubjects,
  updateSchedule,
  updateSubject,
} from "../controllers/index.ts";
import { requireRole } from "../middleware/index.ts";
import { EDITOR_ROLES } from "../models/index.ts";

// mounted by workspaceRouter under /:workspaceId, after requireAuth + requireMember
export const subjectRouter = Router();

const editor = requireRole(...EDITOR_ROLES);

subjectRouter.get("/subjects", getSubjects);
subjectRouter.post("/subjects", editor, createSubject);
subjectRouter.patch("/subjects/:id", editor, updateSubject);
subjectRouter.delete("/subjects/:id", editor, deleteSubject);

subjectRouter.get("/schedules", getSchedules);
subjectRouter.post("/schedules", editor, createSchedule);
subjectRouter.patch("/schedules/:id", editor, updateSchedule);
subjectRouter.delete("/schedules/:id", editor, deleteSchedule);
