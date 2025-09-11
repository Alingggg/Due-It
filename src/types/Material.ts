interface SemesterMaterials {
  id: string;
  semester: 1 | 2;
  title: string;
  description: string;
  materialCount: number;
  createdAt: string;
  subjectId: string;
  subjectName: string;
}

export type { SemesterMaterials };
