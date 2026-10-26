import { Schema, model } from "mongoose";

const WORKSPACE_ROLES = ["admin", "co-admin", "member"] as const;

const memberSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    role: { type: String, enum: WORKSPACE_ROLES, default: "member" },
  },
  { _id: false },
);

const joinCodeSchema = new Schema(
  {
    code: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const workspaceSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: joinCodeSchema, required: true },
    defaultSemester: { type: Number, default: 1 },
    members: { type: [memberSchema], default: [] },
  },
  { collection: "workspaces" },
);

workspaceSchema.index({ "members.userId": 1 });
workspaceSchema.index({ "code.code": 1 }, { unique: true });

export const WorkspaceModel = model("Workspace", workspaceSchema);
