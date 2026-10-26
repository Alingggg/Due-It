// fills the db with mock users, workspaces, subjects, tasks and materials
// run: bun run seed (all accounts use the password "Password1!")
import mongoose, { type Types } from "mongoose";
import connectDb from "./db.ts";
import {
  MaterialGroupModel,
  SubjectModel,
  TaskModel,
  UserModel,
  WorkspaceModel,
  type WorkspaceRole,
} from "./models/index.ts";
import { generateInviteCode } from "./utils/index.ts";

const PASSWORD = "Password1!";

const USERS = [
  ["alice", "Alice", "Reyes"],
  ["bob", "Bob", "Santos"],
  ["carol", "Carol", "Cruz"],
  ["dave", "Dave", "Garcia"],
  ["eve", "Eve", "Mendoza"],
  ["frank", "Frank", "Torres"],
] as const;

type UserKey = (typeof USERS)[number][0];

// [title, taskType, completionType, days from today, time, members who marked it done]
type SeedTask = [
  string,
  "activity" | "exam",
  "individual" | "pair" | "group",
  number,
  string,
  UserKey[],
];

interface SeedSubject {
  name: string;
  code: string;
  instructor: string;
  semester: number;
  // [day, start, end]
  schedules: [string, string, string][];
  tasks: SeedTask[];
}

const WORKSPACES: {
  name: string;
  members: [UserKey, WorkspaceRole][];
  subjects: SeedSubject[];
}[] = [
  {
    name: "BSCS 3A",
    members: [
      ["alice", "admin"],
      ["bob", "co-admin"],
      ["carol", "member"],
      ["dave", "member"],
      ["eve", "member"],
    ],
    subjects: [
      {
        name: "Data Structures",
        code: "CS 211",
        instructor: "Prof. Ramos",
        semester: 1,
        schedules: [["monday", "08:00", "10:00"], ["wednesday", "08:00", "10:00"]],
        tasks: [
          ["Linked List Lab", "activity", "individual", -5, "23:59", ["alice", "carol"]],
          ["Binary Tree Quiz", "exam", "individual", 3, "10:00", ["bob"]],
          ["Hash Table Implementation", "activity", "pair", 10, "23:59", []],
        ],
      },
      {
        name: "Operating Systems",
        code: "CS 221",
        instructor: "Prof. Villanueva",
        semester: 1,
        schedules: [["tuesday", "13:00", "15:00"], ["thursday", "13:00", "15:00"]],
        tasks: [
          ["Midterm Exam", "exam", "individual", -2, "08:00", ["bob", "dave"]],
          ["Process Scheduling Report", "activity", "group", 1, "17:00", ["eve"]],
          ["Deadlock Case Study", "activity", "pair", 7, "23:59", []],
        ],
      },
      {
        name: "Discrete Math",
        code: "MATH 201",
        instructor: "Prof. Aquino",
        semester: 1,
        schedules: [["friday", "10:00", "13:00"]],
        tasks: [
          ["Problem Set 4", "activity", "individual", 5, "23:59", ["alice"]],
          ["Graph Theory Quiz", "exam", "individual", 14, "10:00", []],
        ],
      },
      {
        name: "Web Development",
        code: "IT 231",
        instructor: "Prof. Bautista",
        semester: 2,
        schedules: [["monday", "13:00", "16:00"]],
        tasks: [],
      },
    ],
  },
  {
    name: "Thesis Group",
    members: [
      ["bob", "admin"],
      ["alice", "co-admin"],
      ["frank", "member"],
    ],
    subjects: [
      {
        name: "Thesis Writing 1",
        code: "CS 401",
        instructor: "Dr. Navarro",
        semester: 1,
        schedules: [["saturday", "09:00", "12:00"]],
        tasks: [
          ["Title Proposal", "activity", "group", -10, "17:00", ["alice", "bob", "frank"]],
          ["Chapter 1 Draft", "activity", "group", -1, "23:59", ["bob"]],
          ["Review of Related Literature", "activity", "group", 6, "23:59", []],
          ["Proposal Defense", "exam", "group", 21, "13:00", []],
        ],
      },
      {
        name: "Research Methods",
        code: "CS 402",
        instructor: "Dr. Castillo",
        semester: 1,
        schedules: [["thursday", "16:00", "18:00"]],
        tasks: [
          ["Survey Questionnaire", "activity", "pair", 2, "12:00", ["frank"]],
          ["Methods Quiz", "exam", "individual", 8, "16:00", []],
        ],
      },
      {
        name: "Thesis Writing 2",
        code: "CS 403",
        instructor: "Dr. Navarro",
        semester: 2,
        schedules: [["saturday", "09:00", "12:00"]],
        tasks: [],
      },
    ],
  },
  {
    name: "Org Officers",
    members: [
      ["carol", "admin"],
      ["alice", "member"],
      ["eve", "co-admin"],
      ["frank", "member"],
    ],
    subjects: [
      {
        name: "Events Committee",
        code: "ORG 101",
        instructor: "Ms. Dela Cruz",
        semester: 1,
        schedules: [["wednesday", "17:00", "18:00"]],
        tasks: [
          ["Acquaintance Party Budget", "activity", "group", -3, "17:00", ["carol", "eve"]],
          ["Sponsor Letters", "activity", "pair", 4, "12:00", ["alice"]],
          ["Venue Booking", "activity", "individual", 11, "17:00", []],
        ],
      },
      {
        name: "General Assembly",
        code: "ORG 102",
        instructor: "Ms. Dela Cruz",
        semester: 1,
        schedules: [["friday", "16:00", "18:00"]],
        tasks: [
          ["Meeting Minutes", "activity", "individual", 0, "20:00", ["frank"]],
          ["Officer Evaluation", "exam", "individual", 16, "16:00", []],
        ],
      },
      {
        name: "Foundation Week",
        code: "ORG 201",
        instructor: "Mr. Salazar",
        semester: 2,
        schedules: [["tuesday", "17:00", "19:00"]],
        tasks: [],
      },
    ],
  },
];

function daysFromToday(days: number) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);
  return date;
}

await connectDb();

if (await UserModel.exists({ email: "alice@test.com" })) {
  console.log("already seeded, nothing to do");
  await mongoose.disconnect();
  process.exit(0);
}

const passwordHash = await Bun.password.hash(PASSWORD);
const userIds = {} as Record<UserKey, Types.ObjectId>;

for (const [key, firstName, lastName] of USERS) {
  const user = await UserModel.create({
    email: `${key}@test.com`,
    passwordHash,
    firstName,
    lastName,
  });
  userIds[key] = user._id;
}

for (const { name, members, subjects } of WORKSPACES) {
  const workspace = await WorkspaceModel.create({
    name,
    invite: { code: generateInviteCode() },
    members: members.map(([key, role]) => ({ userId: userIds[key], role })),
  });

  for (const { name: subjectName, code, instructor, semester, schedules, tasks } of subjects) {
    const subject = await SubjectModel.create({
      workspaceId: workspace._id,
      name: subjectName,
      subjectCode: code,
      instructorName: instructor,
      semester,
      schedules: schedules.map(([dayOfWeek, startTime, endTime]) => ({
        dayOfWeek,
        startTime,
        endTime,
      })),
    });

    await TaskModel.insertMany(
      tasks.map(([title, taskType, completionType, days, dueTime, doneBy]) => ({
        workspaceId: workspace._id,
        subjectId: subject._id,
        title,
        description: `${title} for ${subjectName}.`,
        taskType,
        completionType,
        dueDate: daysFromToday(days),
        dueTime,
        completedBy: doneBy.map((key) => userIds[key]),
      })),
    );

    await MaterialGroupModel.create({
      workspaceId: workspace._id,
      subjectId: subject._id,
      title: `${subjectName} References`,
      description: "Slides and readings shared in class.",
      materials: [
        { name: "Course Syllabus", url: "https://example.com/syllabus", isLink: true },
        { name: "Lecture Slides", url: "https://example.com/slides", isLink: true },
      ],
    });
  }
}

console.log(`seeded ${USERS.length} users and ${WORKSPACES.length} workspaces`);
await mongoose.disconnect();
