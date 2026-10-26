import { Schema, model } from "mongoose";
import { timeOfDay } from "./common.ts";

const DAYS_OF_WEEK = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

const scheduleSchema = new Schema({
  dayOfWeek: { type: String, enum: DAYS_OF_WEEK, required: true },
  startTime: timeOfDay,
  endTime: timeOfDay,
});

const subjectSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    subjectCode: { type: String, required: true },
    instructorName: { type: String, required: true },
    semester: { type: Number, required: true },
    schedules: { type: [scheduleSchema], default: [] },
  },
  { collection: "subjects" }
);

subjectSchema.index({ workspaceId: 1, semester: 1 });

export const SubjectModel = model("Subject", subjectSchema);
