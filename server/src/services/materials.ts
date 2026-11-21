import path from "node:path";
import { Types } from "mongoose";
import { MaterialGroupModel, SubjectModel } from "../models/index.ts";
import type { AddMaterialsInput, MaterialGroupInput, UploadRequest } from "../types/index.ts";
import {
  HttpError,
  copyFile,
  createUploadPost,
  deleteFile,
  deleteFiles,
  deletePrefix,
  getDownloadUrl,
  headFile,
} from "../utils/index.ts";

type MaterialGroup = InstanceType<typeof MaterialGroupModel>;
type GroupFilter =
  | { _id: string; workspaceId: Types.ObjectId }
  | { subjectId: { $in: Types.ObjectId[] } };
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

// material files live in S3 at <workspaceId>/<materialGroupId>/<materialId>.<ext>
export async function deleteMaterialGroups(filter: GroupFilter) {
  const groups = await MaterialGroupModel.find(filter, { workspaceId: 1 });
  await MaterialGroupModel.deleteMany({ _id: { $in: groups.map((g) => g._id) } });
  await Promise.all(groups.map((g) => deletePrefix(`${g.workspaceId}/${g._id}/`)));
}

// also deletes the group's uploaded files
export async function deleteMaterialGroup(workspaceId: Types.ObjectId, groupId: string) {
  const filter = { _id: groupId, workspaceId };

  if (!(await MaterialGroupModel.exists(filter))) {
    throw new HttpError(404, "Material group not found");
  }

  await deleteMaterialGroups(filter);
}

// step 1 of an upload: the browser sends each file straight to S3 under tmp/
export async function createUploads(
  workspaceId: Types.ObjectId,
  groupId: string,
  files: UploadRequest["files"],
) {
  const group = await MaterialGroupModel.findOne({ _id: groupId, workspaceId }, { _id: 1 });

  if (!group) throw new HttpError(404, "Material group not found");

  return Promise.all(
    files.map(async (file) => {
      const ext = path.extname(file.name).toLowerCase();
      const key = `tmp/${workspaceId}/${group.id}/${new Types.ObjectId()}${ext}`;
      const { url, fields } = await createUploadPost(key, file.type || "application/octet-stream");
      return { key, url, fields };
    }),
  );
}

// step 2: confirm the uploads, move them out of tmp/ and save them with any links
export async function addMaterials(
  workspaceId: Types.ObjectId,
  groupId: string,
  { links, files }: AddMaterialsInput,
) {
  if (!files.length && !links.length) {
    throw new HttpError(400, "At least one file or link is required");
  }

  const group = await MaterialGroupModel.findOne({ _id: groupId, workspaceId });

  if (!group) throw new HttpError(404, "Material group not found");

  const keyPattern = new RegExp(`^tmp/${group.workspaceId}/${group.id}/([0-9a-f]{24})\\.[a-z0-9]+$`);
  const uploads = files.map((file) => {
    const id = keyPattern.exec(file.key)?.[1];
    if (!id || group.materials.id(id)) throw new HttpError(400, "Invalid upload key");
    return { ...file, id, finalKey: file.key.slice("tmp/".length) };
  });

  if (new Set(uploads.map((u) => u.key)).size !== uploads.length) {
    throw new HttpError(400, "Duplicate upload key");
  }

  const heads = await Promise.all(uploads.map((u) => headFile(u.key)));

  if (heads.some((head) => !head)) throw new HttpError(400, "File was not uploaded");

  for (const link of links) group.materials.push({ ...link, isLink: true });

  try {
    await Promise.all(uploads.map((u) => copyFile(u.key, u.finalKey)));

    uploads.forEach((u, i) => {
      group.materials.push({
        _id: u.id,
        name: u.name,
        url: u.finalKey,
        isLink: false,
        size: heads[i]!.size,
        type: heads[i]!.type,
      });
    });

    await group.save();
  } catch (err) {
    await deleteFiles(uploads.map((u) => u.finalKey)).catch(() => {});
    throw err;
  }

  // anything left behind in tmp/ is expired by the bucket's lifecycle rule
  await deleteFiles(uploads.map((u) => u.key)).catch(() => {});

  return group.materials;
}

export async function getMaterialDownloadUrl(workspaceId: Types.ObjectId, materialId: string) {
  const found = await findMaterial(workspaceId, materialId);

  if (!found || found.material.isLink) throw new HttpError(404, "File not found");

  return getDownloadUrl(found.material.url, found.material.name);
}

export async function deleteMaterial(workspaceId: Types.ObjectId, materialId: string) {
  const found = await findMaterial(workspaceId, materialId);

  if (!found) throw new HttpError(404, "Material not found");

  const { group, material } = found;
  material.deleteOne();
  await group.save();

  if (!material.isLink) await deleteFile(material.url);
}
