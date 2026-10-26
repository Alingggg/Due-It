import { rm } from "node:fs/promises";
import path from "node:path";
import type { Types } from "mongoose";
import { MaterialGroupModel, SubjectModel, TaskModel } from "../models/index.ts";

// material files live at uploads/<workspaceId>/<materialGroupId>/<materialId>.<ext>
export const UPLOADS_DIR = path.resolve("uploads");

export function removeUploads(...segments: (string | Types.ObjectId)[]) {
  return rm(path.join(UPLOADS_DIR, ...segments.map(String)), {
    recursive: true,
    force: true,
  });
}

type Filter = { _id?: Types.ObjectId | string; workspaceId?: Types.ObjectId; subjectId?: { $in: Types.ObjectId[] } };

export async function deleteMaterialGroups(filter: Filter) {
  const groups = await MaterialGroupModel.find(filter, { workspaceId: 1 });
  await MaterialGroupModel.deleteMany({ _id: { $in: groups.map((g) => g._id) } });
  await Promise.all(groups.map((g) => removeUploads(g.workspaceId, g._id)));
}

export async function deleteSubjects(filter: Filter) {
  const subjects = await SubjectModel.find(filter);
  const subjectIds = subjects.map((s) => s._id);

  await TaskModel.deleteMany({ subjectId: { $in: subjectIds } });
  await deleteMaterialGroups({ subjectId: { $in: subjectIds } });
  await SubjectModel.deleteMany({ _id: { $in: subjectIds } });
}
