import * as z from "zod";
import { semesterSchema } from "./common.ts";

export const workspaceNameSchema = z.object({ name: z.string().trim().min(1).max(100) });

export const defaultSemesterSchema = z.object({ semester: semesterSchema });

export const inviteCodeSchema = z.object({ code: z.string().trim().min(1) });

export const codeStatusSchema = z.object({ enabled: z.boolean() });

export const memberRoleSchema = z.object({ role: z.enum(["admin", "co-admin", "member"]) });
