import { Router } from "express";
import {
  addMaterials,
  createMaterialGroup,
  createUploads,
  deleteMaterial,
  deleteMaterialGroup,
  downloadMaterial,
  getMaterialGroup,
  getMaterialGroups,
  updateMaterialGroup,
} from "../controllers/index.ts";
import { requireRole } from "../middleware/index.ts";
import { EDITOR_ROLES } from "../models/index.ts";

// mounted by workspaceRouter under /:workspaceId, after requireAuth + requireMember
export const materialRouter = Router();

const editor = requireRole(...EDITOR_ROLES);

materialRouter.get("/material-groups", getMaterialGroups);
materialRouter.get("/material-groups/:id", getMaterialGroup);
materialRouter.post("/material-groups", editor, createMaterialGroup);
materialRouter.patch("/material-groups/:id", editor, updateMaterialGroup);
materialRouter.delete("/material-groups/:id", editor, deleteMaterialGroup);
materialRouter.post("/material-groups/:id/uploads", editor, createUploads);
materialRouter.post("/material-groups/:id/materials", editor, addMaterials);

materialRouter.get("/materials/:materialId/download", downloadMaterial);
materialRouter.delete("/materials/:materialId", editor, deleteMaterial);
