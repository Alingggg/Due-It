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
    .filter((member) => member.profile); // Filter out any members without profiles
};
