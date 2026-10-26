import { Router } from "express";
import multer from "multer";
import {
  addMaterials,
  createMaterialGroup,
  deleteMaterial,
  deleteMaterialGroup,
  downloadMaterial,
  getMaterialGroup,
  getMaterialGroups,
  updateMaterialGroup,
} from "../controllers/index.ts";
import { requireRole } from "../middleware/index.ts";

// mounted by workspaceRouter under /:workspaceId, after requireAuth + requireMember
export const materialRouter = Router();

const editor = requireRole("admin", "co-admin");

const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } });

materialRouter.get("/material-groups", getMaterialGroups);
materialRouter.get("/material-groups/:id", getMaterialGroup);
materialRouter.post("/material-groups", editor, createMaterialGroup);
materialRouter.patch("/material-groups/:id", editor, updateMaterialGroup);
materialRouter.delete("/material-groups/:id", editor, deleteMaterialGroup);
materialRouter.post("/material-groups/:id/materials", editor, upload.array("files"), addMaterials);

materialRouter.get("/materials/:materialId/download", downloadMaterial);
materialRouter.delete("/materials/:materialId", editor, deleteMaterial);
