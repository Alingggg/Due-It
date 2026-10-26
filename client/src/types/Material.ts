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

export type { SemesterMaterialGroup, Material, MaterialGroupDetail };
