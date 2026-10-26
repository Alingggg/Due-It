import { Schema, model } from "mongoose";

const materialSchema = new Schema({
  name: { type: String, required: true },
  // external link when isLink, otherwise the uploaded file's storage path
  url: { type: String, required: true },
  isLink: { type: Boolean, required: true },
  size: { type: Number, default: null },
  type: { type: String, default: null },
});

const materialGroupSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, required: true },
    subjectId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    description: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    materials: { type: [materialSchema], default: [] },
  },
  { collection: "material_groups" }
);

materialGroupSchema.index({ subjectId: 1 });
materialGroupSchema.index({ workspaceId: 1 });

export const MaterialGroupModel = model("MaterialGroup", materialGroupSchema);
