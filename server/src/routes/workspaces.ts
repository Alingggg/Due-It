import { Router } from "express";
import {
  createWorkspace,
  deleteMember,
  deleteWorkspace,
  getCode,
  getMembers,
  getMyWorkspace,
  joinWorkspace,
  renewCode,
  updateCodeStatus,
  updateDefaultSemester,
  updateMemberRole,
  updateWorkspaceName,
} from "../controllers/index.ts";
import { requireAuth, requireMember, requireRole } from "../middleware/index.ts";
// imported directly, not through ./index.ts, to avoid a circular import
import { materialRouter } from "./materials.ts";
import { subjectRouter } from "./subjects.ts";
import { taskRouter } from "./tasks.ts";

export const workspaceRouter = Router();

const admin = requireRole("admin");

workspaceRouter.use(requireAuth);

workspaceRouter.get("/mine", getMyWorkspace);
workspaceRouter.post("/", createWorkspace);
workspaceRouter.post("/join", joinWorkspace);

// everything below is scoped to one workspace the user is a member of
workspaceRouter.use("/:workspaceId", requireMember);

workspaceRouter.patch("/:workspaceId", admin, updateWorkspaceName);
workspaceRouter.delete("/:workspaceId", admin, deleteWorkspace);
workspaceRouter.patch("/:workspaceId/default-semester", admin, updateDefaultSemester);

workspaceRouter.get("/:workspaceId/code", getCode);
workspaceRouter.post("/:workspaceId/code/renew", admin, renewCode);
workspaceRouter.patch("/:workspaceId/code", admin, updateCodeStatus);

workspaceRouter.get("/:workspaceId/members", getMembers);
workspaceRouter.patch("/:workspaceId/members/:userId", admin, updateMemberRole);
workspaceRouter.delete("/:workspaceId/members/:userId", deleteMember);

workspaceRouter.use("/:workspaceId", subjectRouter, taskRouter, materialRouter);
