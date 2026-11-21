import type { Request, Response } from "express";
import { materialService } from "../services/index.ts";
import {
  addMaterialsSchema,
  materialGroupSchema,
  semesterQuerySchema,
  uploadRequestSchema,
} from "../zod-schema/index.ts";

export async function getMaterialGroups(req: Request, res: Response) {
  const { semester } = semesterQuerySchema.parse(req.query);

  res.json(await materialService.getMaterialGroups(req.workspace._id, semester));
}

export async function getMaterialGroup(req: Request, res: Response) {
  res.json(await materialService.getMaterialGroup(req.workspace._id, String(req.params.id)));
}

export async function createMaterialGroup(req: Request, res: Response) {
  const data = materialGroupSchema.parse(req.body);

  res.status(201).json(await materialService.createMaterialGroup(req.workspace._id, data));
}

export async function updateMaterialGroup(req: Request, res: Response) {
  const data = materialGroupSchema.parse(req.body);

  res.json(
    await materialService.updateMaterialGroup(req.workspace._id, String(req.params.id), data),
  );
}

export async function deleteMaterialGroup(req: Request, res: Response) {
  await materialService.deleteMaterialGroup(req.workspace._id, String(req.params.id));

  res.status(204).end();
}

export async function createUploads(req: Request, res: Response) {
  const { files } = uploadRequestSchema.parse(req.body);

  res.json(await materialService.createUploads(req.workspace._id, String(req.params.id), files));
}

export async function addMaterials(req: Request, res: Response) {
  const data = addMaterialsSchema.parse(req.body);

  res
    .status(201)
    .json(await materialService.addMaterials(req.workspace._id, String(req.params.id), data));
}

export async function downloadMaterial(req: Request, res: Response) {
  const url = await materialService.getMaterialDownloadUrl(
    req.workspace._id,
    String(req.params.materialId),
  );

  res.json({ url });
}

export async function deleteMaterial(req: Request, res: Response) {
  await materialService.deleteMaterial(req.workspace._id, String(req.params.materialId));

  res.status(204).end();
}
