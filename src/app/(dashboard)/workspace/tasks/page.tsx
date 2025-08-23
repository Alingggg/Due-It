"use client";
import { useState } from "react";
import { TaskCard, Dropdown } from "@/components";
import {
  getTasksByWorkspaceId,
  mockSubjects,
  getSubjectById,
} from "@/data/mockData";
import { FaClipboardList, FaFilter } from "react-icons/fa";

function TasksPage() {
  const tasks = getTasksByWorkspaceId("1");
  const [sortBy, setSortBy] = useState("dueDate");
  const [filterType, setFilterType] = useState("all");
  const [filterDoneBy, setFilterDoneBy] = useState("all");

  // Get subjects for this workspace
  const workspaceSubjects = mockSubjects.filter(
    (subject) => subject.workspaceId === "1"
  );

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const typeMatch = filterType === "all" || task.type === filterType;
    const doneByMatch = filterDoneBy === "all" || task.doneBy === filterDoneBy;
    return typeMatch && doneByMatch;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === "subject") {
      const subjectA =
        workspaceSubjects.find((s) => s.id === a.subjectId)?.name || "";
      const subjectB =
        workspaceSubjects.find((s) => s.id === b.subjectId)?.name || "";
      return subjectA.localeCompare(subjectB);
    }
    return 0;
  });

  // Group tasks by subject when sorted by subject
  const groupedTasks =
    sortBy === "subject"
      ? sortedTasks.reduce((groups, task) => {
          const subject = getSubjectById(task.subjectId);
          const subjectName = subject?.name || "Unknown Subject";
          if (!groups[subjectName]) {
            groups[subjectName] = [];
          }
          groups[subjectName].push(task);
          return groups;
        }, {} as Record<string, typeof tasks>)
      : null;

  // Sort tasks within each subject by due date
  if (groupedTasks) {
    Object.keys(groupedTasks).forEach((subjectName) => {
      groupedTasks[subjectName].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    });
  }

  const renderTasks = () => {
    if (sortBy === "subject" && groupedTasks) {
      return Object.entries(groupedTasks).map(([subjectName, subjectTasks]) => (
        <div key={subjectName} className="space-y-4">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-slate-800 pr-4 whitespace-nowrap">
              {subjectName}
            </h2>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>
          <div className="space-y-4">
            {subjectTasks.map((task) => (
              <TaskCard key={task.id} task={task} hideSubject={true} />
            ))}
          </div>
        </div>
      ));
    } else {
      return sortedTasks.map((task) => <TaskCard key={task.id} task={task} />);
    }
  };

  // Dropdown options
  const sortOptions = [
    { value: "dueDate", label: "Due Date" },
    { value: "subject", label: "Subject" },
  ];

  const typeOptions = [
    { value: "all", label: "All" },
    { value: "activity", label: "Activity" },
    { value: "quiz", label: "Quiz" },
  ];

  const doneByOptions = [
    { value: "all", label: "All" },
    { value: "individual", label: "Individual" },
    { value: "pair", label: "Pair" },
    { value: "group", label: "Group" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Tasks</h1>
        <div className="text-sm text-slate-500">
          {sortedTasks.length} of {tasks.length} tasks
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center text-sm text-slate-600">
          <FaFilter className="w-4 h-4 mr-2" />
          <span>Filters:</span>
        </div>

        {/* Sort By */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-slate-600">Sort by:</label>
          <Dropdown value={sortBy} onChange={setSortBy} options={sortOptions} />
        </div>

        {/* Filter by Type */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-slate-600">Type:</label>
          <Dropdown
            value={filterType}
            onChange={setFilterType}
            options={typeOptions}
          />
        </div>

        {/* Filter by Done By */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-slate-600">Done by:</label>
          <Dropdown
            value={filterDoneBy}
            onChange={setFilterDoneBy}
            options={doneByOptions}
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-6">{renderTasks()}</div>

      {/* Empty State */}
      {sortedTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-2">
            <FaClipboardList className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-1">
            No tasks match your filters
          </h3>
          <p className="text-slate-600">
            Try adjusting your filters to see more tasks.
          </p>
        </div>
      )}
    </div>
  );
}

export default TasksPage;
