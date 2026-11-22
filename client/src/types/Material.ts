import type * as z from "zod";
import type {
  MaterialGroupSchema,
  MaterialSchema,
  MaterialsSchema,
} from "@/zod-schema";
import type { Semester } from "./Semester";

interface SemesterMaterialGroup {
  id: string;
  semester: Semester;
  title: string;
  description: string | null;
  materialCount: number;
  createdAt: string;
  subjectId: string;
  subjectName: string;
}

interface Material {
  id: string;
  materialGroupId: string;
  isLink: boolean;
  name: string;
  url: string;
  size: number | null;
  type: string | null;
}

interface MaterialGroupDetail extends SemesterMaterialGroup {
  materials: Material[];
}

type MaterialGroupInput = z.infer<typeof MaterialGroupSchema>;

type MaterialInput = z.infer<typeof MaterialSchema>;

type MaterialsInput = z.infer<typeof MaterialsSchema>;

type UploadTarget = {
  key: string;
  url: string;
  fields: Record<string, string>;
};

export type {
  SemesterMaterialGroup,
  Material,
  MaterialGroupDetail,
  MaterialGroupInput,
  MaterialInput,
  MaterialsInput,
  UploadTarget,
};
