import type { Types } from "mongoose";
import { MaterialGroupModel, SubjectModel, TaskModel } from "../models/index.ts";
import { deletePrefix } from "./s3.ts";

export function removeUploads(...segments: (string | Types.ObjectId)[]) {
  return deletePrefix(`${segments.map(String).join("/")}/`);
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
