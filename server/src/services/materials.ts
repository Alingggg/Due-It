import { rm } from "node:fs/promises";
import path from "node:path";
import type { Types } from "mongoose";
import { MaterialGroupModel, SubjectModel } from "../models/index.ts";
import type { MaterialGroupInput, MaterialLinks } from "../types/index.ts";
import { HttpError, UPLOADS_DIR, deleteMaterialGroups } from "../utils/index.ts";

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

async function assertSubjectExists(subjectId: string, workspaceId: Types.ObjectId) {
  if (!(await SubjectModel.exists({ _id: subjectId, workspaceId }))) {
    throw new HttpError(404, "Subject not found");
  }
}

async function findMaterial(workspaceId: Types.ObjectId, materialId: string) {
  const group = await MaterialGroupModel.findOne({ "materials._id": materialId, workspaceId });
  const material = group?.materials.id(materialId);
  return group && material ? { group, material } : null;
}

export async function getMaterialGroups(workspaceId: Types.ObjectId, semester: number) {
  const subjects = await SubjectModel.find({ workspaceId, semester });
  const groups = await MaterialGroupModel.find({
    subjectId: { $in: subjects.map((s) => s._id) },
  }).sort({ createdAt: -1 });

  return groups.map((group) => {
    const subject = subjects.find((s) => s._id.equals(group.subjectId))!;
    return toSemesterMaterialGroup(group, subject);
  });
}

export async function getMaterialGroup(workspaceId: Types.ObjectId, groupId: string) {
  const group = await MaterialGroupModel.findOne({ _id: groupId, workspaceId });
  const subject = group && (await SubjectModel.findById(group.subjectId));

  if (!group || !subject) throw new HttpError(404, "Material group not found");

  return {
    ...toSemesterMaterialGroup(group, subject),
    materials: group.materials.map((material) => ({
      ...material.toJSON(),
      materialGroupId: group.id,
    })),
  };
}

export async function createMaterialGroup(
  workspaceId: Types.ObjectId,
  data: MaterialGroupInput,
) {
  await assertSubjectExists(data.subjectId, workspaceId);

  return MaterialGroupModel.create({ ...data, workspaceId });
}

export async function updateMaterialGroup(
  workspaceId: Types.ObjectId,
  groupId: string,
  data: MaterialGroupInput,
) {
  await assertSubjectExists(data.subjectId, workspaceId);

  const group = await MaterialGroupModel.findOneAndUpdate({ _id: groupId, workspaceId }, data, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!group) throw new HttpError(404, "Material group not found");

  return group;
}

// also deletes the group's uploaded files
export async function deleteMaterialGroup(workspaceId: Types.ObjectId, groupId: string) {
  const filter = { _id: groupId, workspaceId };

  if (!(await MaterialGroupModel.exists(filter))) {
    throw new HttpError(404, "Material group not found");
  }

  await deleteMaterialGroups(filter);
}

export async function addMaterials(
  workspaceId: Types.ObjectId,
  groupId: string,
  links: MaterialLinks,
  files: Express.Multer.File[],
) {
  if (!files.length && !links.length) {
    throw new HttpError(400, "At least one file or link is required");
  }

  const group = await MaterialGroupModel.findOne({ _id: groupId, workspaceId });

  if (!group) throw new HttpError(404, "Material group not found");

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

  return group.materials;
}

// returns where the uploaded file is on disk and the name to download it as
export async function getMaterialFile(workspaceId: Types.ObjectId, materialId: string) {
  const found = await findMaterial(workspaceId, materialId);

  if (!found || found.material.isLink) throw new HttpError(404, "File not found");

  return { filePath: path.join(UPLOADS_DIR, found.material.url), name: found.material.name };
}

export async function deleteMaterial(workspaceId: Types.ObjectId, materialId: string) {
  const found = await findMaterial(workspaceId, materialId);

  if (!found) throw new HttpError(404, "Material not found");

  const { group, material } = found;
  material.deleteOne();
  await group.save();

  if (!material.isLink) await rm(path.join(UPLOADS_DIR, material.url), { force: true });
}
