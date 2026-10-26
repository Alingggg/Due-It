import type { Request, Response } from "express";
import { rm } from "node:fs/promises";
import path from "node:path";
import { MaterialGroupModel, SubjectModel } from "../models/index.ts";
import {
  materialGroupSchema,
  materialLinksSchema,
  semesterQuerySchema,
} from "../zod-schema/index.ts";
import { UPLOADS_DIR, deleteMaterialGroups } from "../utils/index.ts";

type MaterialGroup = InstanceType<typeof MaterialGroupModel>;
type Subject = { id: string; name: string; semester: number };

// same shape the client got from the old semester_materials view
function toSemesterMaterialGroup(group: MaterialGroup, subject: Subject) {
  return {
    id: group.id,
    semester: subject.semester,
    title: group.title,
    description: group.description,
    materialCount: group.materials.length,
    createdAt: group.createdAt,
    subjectId: subject.id,
    subjectName: subject.name,
  };
}

function subjectExists(subjectId: string, workspaceId: MaterialGroup["workspaceId"]) {
  return SubjectModel.exists({ _id: subjectId, workspaceId });
}

function findGroupByMaterial(req: Request) {
  return MaterialGroupModel.findOne({
    "materials._id": req.params.materialId,
    workspaceId: req.workspace._id,
  });
}

export async function getMaterialGroups(req: Request, res: Response) {
  const { semester } = semesterQuerySchema.parse(req.query);

  const subjects = await SubjectModel.find({ workspaceId: req.workspace._id, semester });
  const groups = await MaterialGroupModel.find({
    subjectId: { $in: subjects.map((s) => s._id) },
  }).sort({ createdAt: -1 });

  res.json(
    groups.map((group) => {
      const subject = subjects.find((s) => s._id.equals(group.subjectId))!;
      return toSemesterMaterialGroup(group, subject);
    }),
  );
}

export async function getMaterialGroup(req: Request, res: Response) {
  const group = await MaterialGroupModel.findOne({
    _id: req.params.id,
    workspaceId: req.workspace._id,
  });
  const subject = group && (await SubjectModel.findById(group.subjectId));

  if (!group || !subject) {
    res.status(404).json({ message: "Material group not found" });
    return;
  }

  res.json({
    ...toSemesterMaterialGroup(group, subject),
    materials: group.materials.map((material) => ({
      ...material.toJSON(),
      materialGroupId: group.id,
    })),
  });
}

export async function createMaterialGroup(req: Request, res: Response) {
  const data = materialGroupSchema.parse(req.body);

  if (!(await subjectExists(data.subjectId, req.workspace._id))) {
    res.status(404).json({ message: "Subject not found" });
    return;
  }

  const group = await MaterialGroupModel.create({ ...data, workspaceId: req.workspace._id });

  res.status(201).json(group);
}

export async function updateMaterialGroup(req: Request, res: Response) {
  const data = materialGroupSchema.parse(req.body);

  if (!(await subjectExists(data.subjectId, req.workspace._id))) {
    res.status(404).json({ message: "Subject not found" });
    return;
  }

  const group = await MaterialGroupModel.findOneAndUpdate(
    { _id: req.params.id, workspaceId: req.workspace._id },
    data,
    { returnDocument: "after", runValidators: true },
  );

  if (!group) {
    res.status(404).json({ message: "Material group not found" });
    return;
  }

  res.json(group);
}

// also deletes the group's uploaded files
export async function deleteMaterialGroup(req: Request, res: Response) {
  const filter = { _id: String(req.params.id), workspaceId: req.workspace._id };

  if (!(await MaterialGroupModel.exists(filter))) {
    res.status(404).json({ message: "Material group not found" });
    return;
  }

  await deleteMaterialGroups(filter);

  res.status(204).end();
}

// multipart: `files` (uploaded via multer) + `links` (JSON string)
export async function addMaterials(req: Request, res: Response) {
  const links = materialLinksSchema.parse(req.body.links);
  const files = (req.files ?? []) as Express.Multer.File[];

  if (!files.length && !links.length) {
    res.status(400).json({ message: "At least one file or link is required" });
    return;
  }

  const group = await MaterialGroupModel.findOne({
    _id: req.params.id,
    workspaceId: req.workspace._id,
  });

  if (!group) {
    res.status(404).json({ message: "Material group not found" });
    return;
  }

  for (const link of links) group.materials.push({ ...link, isLink: true });

  for (const file of files) {
    const material = group.materials.create({
      name: file.originalname,
      url: "",
      isLink: false,
      size: file.size,
      type: file.mimetype,
    });

    // stored relative to UPLOADS_DIR, like the old storage path
    material.url = `${group.workspaceId}/${group.id}/${material._id}${path.extname(file.originalname)}`;
    await Bun.write(path.join(UPLOADS_DIR, material.url), file.buffer);

    group.materials.push(material);
  }

  await group.save();

  res.status(201).json(group.materials);
}

export async function downloadMaterial(req: Request, res: Response) {
  const group = await findGroupByMaterial(req);
  const material = group?.materials.id(String(req.params.materialId));

  if (!material || material.isLink) {
    res.status(404).json({ message: "File not found" });
    return;
  }

  res.download(path.join(UPLOADS_DIR, material.url), material.name);
}

export async function deleteMaterial(req: Request, res: Response) {
  const group = await findGroupByMaterial(req);
  const material = group?.materials.id(String(req.params.materialId));

  if (!group || !material) {
    res.status(404).json({ message: "Material not found" });
    return;
  }

  material.deleteOne();
  await group.save();

  if (!material.isLink) await rm(path.join(UPLOADS_DIR, material.url), { force: true });

  res.status(204).end();
}
