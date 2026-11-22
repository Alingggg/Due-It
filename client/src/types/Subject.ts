import type * as z from "zod";
import type { SubjectSchema } from "@/zod-schema";
import type { Semester } from "./Semester";

interface Subject {
  id: string;
  workspaceId: string;
  semester: Semester;
  name: string;
  subjectCode: string;
  instructorName: string;
}

type SubjectFormInput = z.infer<typeof SubjectSchema>;

type SubjectInput = Pick<
  Subject,
  "name" | "subjectCode" | "instructorName" | "semester"
>;

export type { Subject, SubjectFormInput, SubjectInput };
