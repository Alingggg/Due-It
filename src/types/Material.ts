interface SemesterMaterialGroup {
  id: string;
  semester: 1 | 2;
  title: string;
  description: string;
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

export type { SemesterMaterialGroup, Material };
