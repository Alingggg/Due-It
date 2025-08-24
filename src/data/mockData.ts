export interface Workspace {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  workspaceId: string;
  name: string;
}

export interface Task {
  id: string;
  subjectId: string;
  title: string;
  doneBy: "individual" | "pair" | "group";
  type: "activity" | "quiz";
  description: string;
  dueDate: string;
}

export interface MaterialGroup {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  createdDate: string;
  materialCount?: number; // computed field
}

export interface Material {
  id: string;
  materialGroupId: string;
  fileName: string; // This will be the display name for both files and links
  fileSize?: number; // Optional for links
  fileType: string; // For links, this could be "link/youtube", "link/google-drive", etc.
  downloadUrl: string; // For files: download URL, for links: the actual link
  isLink: boolean; // Flag to distinguish between files and links
}

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
}

export interface WorkspaceMember {
  workspaceId: string;
  userId: string;
  role: "admin" | "co" | "member";
}

export interface InviteCode {
  id: string;
  workspaceId: string;
  code: string;
  enabled: boolean;
}

export const mockWorkspaces: Workspace[] = [
  {
    id: "1",
    name: "Computer Science Department",
  },
  {
    id: "2",
    name: "Mathematics Department",
  },
];

export const mockSubjects: Subject[] = [
  {
    id: "1",
    workspaceId: "1",
    name: "Data Structures and Algorithms",
  },
  {
    id: "2",
    workspaceId: "1",
    name: "Database Management Systems",
  },
  {
    id: "3",
    workspaceId: "1",
    name: "Web Development",
  },
  {
    id: "4",
    workspaceId: "2",
    name: "Calculus I",
  },
  {
    id: "5",
    workspaceId: "2",
    name: "Linear Algebra",
  },
];

export const mockTasks: Task[] = [
  {
    id: "1",
    subjectId: "1",
    title: "Binary Search Tree Implementation",
    doneBy: "individual",
    type: "activity",
    description:
      "Implement a complete binary search tree with insertion, deletion, and traversal methods.",
    dueDate: "2025-08-30T23:59:00Z",
  },
  {
    id: "2",
    subjectId: "1",
    title: "Algorithm Complexity Quiz",
    doneBy: "individual",
    type: "quiz",
    description: "Quiz covering Big O notation and time complexity analysis.",
    dueDate: "2025-08-25T14:00:00Z",
  },
  {
    id: "3",
    subjectId: "2",
    title: "Database Design Project",
    doneBy: "group",
    type: "activity",
    description:
      "Design and implement a complete database system for a library management system.",
    dueDate: "2025-09-15T23:59:00Z",
  },
  {
    id: "4",
    subjectId: "2",
    title: "SQL Queries Assignment",
    doneBy: "pair",
    type: "activity",
    description:
      "Complete complex SQL queries involving joins, subqueries, and aggregate functions.",
    dueDate: "2025-08-28T18:00:00Z",
  },
  {
    id: "5",
    subjectId: "3",
    title: "React Component Quiz",
    doneBy: "individual",
    type: "quiz",
    description:
      "Quiz on React hooks, state management, and component lifecycle.",
    dueDate: "2025-08-26T10:00:00Z",
  },
  {
    id: "6",
    subjectId: "3",
    title: "Full Stack Web Application",
    doneBy: "group",
    type: "activity",
    description:
      "Build a complete web application using React, Node.js, and MongoDB.",
    dueDate: "2025-09-30T23:59:00Z",
  },
  {
    id: "7",
    subjectId: "4",
    title: "Derivatives Problem Set",
    doneBy: "individual",
    type: "activity",
    description:
      "Solve advanced problems involving chain rule, product rule, and quotient rule.",
    dueDate: "2025-08-27T23:59:00Z",
  },
  {
    id: "8",
    subjectId: "5",
    title: "Matrix Operations Quiz",
    doneBy: "individual",
    type: "quiz",
    description:
      "Quiz on matrix multiplication, determinants, and eigenvalues.",
    dueDate: "2025-08-29T15:30:00Z",
  },
];

export const mockMaterialGroups: MaterialGroup[] = [
  {
    id: "1",
    subjectId: "1",
    title: "Binary Trees and Data Structures",
    description:
      "Essential materials covering binary tree concepts, implementation guides, and practical examples.",
    createdDate: "2025-08-20T10:00:00Z",
  },
  {
    id: "2",
    subjectId: "1",
    title: "Algorithm Complexity Analysis",
    description:
      "Resources for understanding Big O notation and analyzing algorithm performance.",
    createdDate: "2025-08-18T14:00:00Z",
  },
  {
    id: "3",
    subjectId: "2",
    title: "Database Design Fundamentals",
    description:
      "Complete guide to database design principles, normalization, and best practices.",
    createdDate: "2025-08-19T16:00:00Z",
  },
  {
    id: "4",
    subjectId: "2",
    title: "SQL Reference and Examples",
    description:
      "SQL commands, syntax reference, and sample database schemas for practice.",
    createdDate: "2025-08-21T11:00:00Z",
  },
  {
    id: "5",
    subjectId: "3",
    title: "React Development Resources",
    description:
      "Comprehensive collection of React guides, hooks documentation, and starter templates.",
    createdDate: "2025-08-17T13:00:00Z",
  },
];

export const mockMaterials: Material[] = [
  // Binary Trees group materials
  {
    id: "1",
    materialGroupId: "1",
    fileName: "Binary Tree Lecture Notes.pdf",
    fileSize: 2456789,
    fileType: "application/pdf",
    downloadUrl:
      "https://example-supabase-url.com/materials/binary-tree-notes.pdf",
    isLink: false,
  },
  {
    id: "2",
    materialGroupId: "1",
    fileName: "Tree Implementation Examples.zip",
    fileSize: 1234567,
    fileType: "application/zip",
    downloadUrl:
      "https://example-supabase-url.com/materials/tree-implementations.zip",
    isLink: false,
  },
  {
    id: "3",
    materialGroupId: "1",
    fileName: "Binary Tree Visualization Tutorial",
    fileType: "link/youtube",
    downloadUrl: "https://www.youtube.com/watch?v=example",
    isLink: true,
  },

  // Algorithm Analysis group materials
  {
    id: "4",
    materialGroupId: "2",
    fileName: "Algorithm Analysis Slides.pptx",
    fileSize: 5234567,
    fileType:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    downloadUrl:
      "https://example-supabase-url.com/materials/algorithm-analysis.pptx",
    isLink: false,
  },
  {
    id: "5",
    materialGroupId: "2",
    fileName: "Sorting Algorithms Code.zip",
    fileSize: 1234567,
    fileType: "application/zip",
    downloadUrl:
      "https://example-supabase-url.com/materials/sorting-algorithms.zip",
    isLink: false,
  },
  {
    id: "6",
    materialGroupId: "2",
    fileName: "Big O Notation Interactive Guide",
    fileType: "link/website",
    downloadUrl: "https://www.bigocheatsheet.com/",
    isLink: true,
  },

  // Database Design group materials
  {
    id: "7",
    materialGroupId: "3",
    fileName: "Database Design Principles.pdf",
    fileSize: 3456789,
    fileType: "application/pdf",
    downloadUrl:
      "https://example-supabase-url.com/materials/db-design-principles.pdf",
    isLink: false,
  },
  {
    id: "8",
    materialGroupId: "3",
    fileName: "ER Diagram Examples.pdf",
    fileSize: 2345678,
    fileType: "application/pdf",
    downloadUrl:
      "https://example-supabase-url.com/materials/er-diagram-examples.pdf",
    isLink: false,
  },
  {
    id: "9",
    materialGroupId: "3",
    fileName: "Database Design Tutorial Series",
    fileType: "link/youtube",
    downloadUrl: "https://www.youtube.com/playlist?list=example",
    isLink: true,
  },

  // SQL Reference group materials
  {
    id: "10",
    materialGroupId: "4",
    fileName: "SQL Reference Sheet.docx",
    fileSize: 987654,
    fileType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    downloadUrl:
      "https://example-supabase-url.com/materials/sql-reference.docx",
    isLink: false,
  },
  {
    id: "11",
    materialGroupId: "4",
    fileName: "Sample Database Schema.sql",
    fileSize: 456789,
    fileType: "application/sql",
    downloadUrl: "https://example-supabase-url.com/materials/sample-schema.sql",
    isLink: false,
  },
  {
    id: "12",
    materialGroupId: "4",
    fileName: "W3Schools SQL Tutorial",
    fileType: "link/website",
    downloadUrl: "https://www.w3schools.com/sql/",
    isLink: true,
  },

  // React Development group materials
  {
    id: "13",
    materialGroupId: "5",
    fileName: "React Hooks Cheat Sheet.pdf",
    fileSize: 1876543,
    fileType: "application/pdf",
    downloadUrl:
      "https://example-supabase-url.com/materials/react-hooks-cheatsheet.pdf",
    isLink: false,
  },
  {
    id: "14",
    materialGroupId: "5",
    fileName: "Node.js Project Template.zip",
    fileSize: 2345678,
    fileType: "application/zip",
    downloadUrl:
      "https://example-supabase-url.com/materials/nodejs-template.zip",
    isLink: false,
  },
  {
    id: "15",
    materialGroupId: "5",
    fileName: "React Component Examples.zip",
    fileSize: 3456789,
    fileType: "application/zip",
    downloadUrl:
      "https://example-supabase-url.com/materials/react-components.zip",
    isLink: false,
  },
  {
    id: "16",
    materialGroupId: "5",
    fileName: "React Official Documentation",
    fileType: "link/website",
    downloadUrl: "https://react.dev/",
    isLink: true,
  },
  {
    id: "17",
    materialGroupId: "5",
    fileName: "React Hooks Tutorial",
    fileType: "link/youtube",
    downloadUrl: "https://www.youtube.com/watch?v=react-hooks-example",
    isLink: true,
  },
];

export const mockProfiles: Profile[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Johnson",
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Williams",
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Brown",
  },
  {
    id: "6",
    firstName: "Emily",
    lastName: "Davis",
  },
  {
    id: "7",
    firstName: "Chris",
    lastName: "Wilson",
  },
  {
    id: "8",
    firstName: "Lisa",
    lastName: "Anderson",
  },
];

export const mockWorkspaceMembers: WorkspaceMember[] = [
  // Computer Science Department (workspace 1)
  {
    workspaceId: "1",
    userId: "1",
    role: "admin",
  },
  {
    workspaceId: "1",
    userId: "2",
    role: "co",
  },
  {
    workspaceId: "1",
    userId: "3",
    role: "member",
  },
  {
    workspaceId: "1",
    userId: "4",
    role: "member",
  },
  {
    workspaceId: "1",
    userId: "5",
    role: "member",
  },

  // Mathematics Department (workspace 2)
  {
    workspaceId: "2",
    userId: "6",
    role: "admin",
  },
  {
    workspaceId: "2",
    userId: "7",
    role: "co",
  },
  {
    workspaceId: "2",
    userId: "8",
    role: "member",
  },
];

export const mockInviteCodes: InviteCode[] = [
  {
    id: "1",
    workspaceId: "1",
    code: "CS2025-ABC123",
    enabled: true,
  },
  {
    id: "2",
    workspaceId: "2",
    code: "MATH2025-XYZ789",
    enabled: false,
  },
];

// Current user context (hardcoded for now)
export const currentUser = {
  id: "1", // John Doe - admin of workspace 1
};

// Helper functions to get related data
export const getSubjectById = (subjectId: string): Subject | undefined => {
  return mockSubjects.find((subject) => subject.id === subjectId);
};

export const getTasksBySubjectId = (subjectId: string): Task[] => {
  return mockTasks.filter((task) => task.subjectId === subjectId);
};

export const getTasksByWorkspaceId = (workspaceId: string): Task[] => {
  const workspaceSubjects = mockSubjects.filter(
    (subject) => subject.workspaceId === workspaceId
  );
  const subjectIds = workspaceSubjects.map((subject) => subject.id);
  return mockTasks.filter((task) => subjectIds.includes(task.subjectId));
};

export const getMaterialGroupsByWorkspaceId = (
  workspaceId: string
): MaterialGroup[] => {
  const workspaceSubjects = mockSubjects.filter(
    (subject) => subject.workspaceId === workspaceId
  );
  const subjectIds = workspaceSubjects.map((subject) => subject.id);
  return mockMaterialGroups
    .filter((group) => subjectIds.includes(group.subjectId))
    .map((group) => ({
      ...group,
      materialCount: getMaterialsByGroupId(group.id).length,
    }));
};

export const getMaterialsByGroupId = (groupId: string): Material[] => {
  return mockMaterials.filter(
    (material) => material.materialGroupId === groupId
  );
};

export const getMaterialGroupById = (
  groupId: string
): MaterialGroup | undefined => {
  return mockMaterialGroups.find((group) => group.id === groupId);
};

export const getMaterialById = (materialId: string): Material | undefined => {
  return mockMaterials.find((material) => material.id === materialId);
};

export const getMaterialsByWorkspaceId = (workspaceId: string): Material[] => {
  const groups = getMaterialGroupsByWorkspaceId(workspaceId);
  const groupIds = groups.map((group) => group.id);
  return mockMaterials.filter((material) =>
    groupIds.includes(material.materialGroupId)
  );
};

export const getProfileById = (userId: string): Profile | undefined => {
  return mockProfiles.find((profile) => profile.id === userId);
};

export const getWorkspaceMembersByWorkspaceId = (
  workspaceId: string
): (WorkspaceMember & { profile: Profile })[] => {
  return mockWorkspaceMembers
    .filter((member) => member.workspaceId === workspaceId)
    .map((member) => ({
      ...member,
      profile: getProfileById(member.userId)!,
    }))
    .filter((member) => member.profile);
};

export const getInviteCodeByWorkspaceId = (
  workspaceId: string
): InviteCode | undefined => {
  return mockInviteCodes.find((invite) => invite.workspaceId === workspaceId);
};

export const getCurrentUserRole = (
  workspaceId: string
): "admin" | "co" | "member" => {
  const member = mockWorkspaceMembers.find(
    (m) => m.workspaceId === workspaceId && m.userId === currentUser.id
  );
  return member?.role || "member";
};

export const canManageWorkspace = (workspaceId: string): boolean => {
  const role = getCurrentUserRole(workspaceId);
  return role === "admin" || role === "co";
};

// Mock functions to simulate API calls
export const generateNewInviteCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const prefix = "INV2025-";
  let result = prefix;
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Utility function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Utility function to get file icon based on file type
export const getFileIcon = (fileType: string): string => {
  if (fileType.includes("pdf")) return "FaFilePdf";
  if (fileType.includes("word") || fileType.includes("document"))
    return "FaFileWord";
  if (fileType.includes("presentation") || fileType.includes("powerpoint"))
    return "FaFilePowerpoint";
  if (fileType.includes("zip") || fileType.includes("compressed"))
    return "FaFileArchive";
  if (fileType.includes("sql")) return "FaFileCode";
  if (fileType.includes("image")) return "FaFileImage";
  if (fileType.includes("video")) return "FaFileVideo";
  if (fileType.includes("audio")) return "FaFileAudio";
  return "FaFile";
};

export const getCurrentUser = (): { id: string } => {
  return currentUser;
};
