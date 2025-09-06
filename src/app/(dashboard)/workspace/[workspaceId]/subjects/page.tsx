"use client";
import { use, useMemo, useState, useContext } from "react";
import {
  getSubjectsByWorkspaceId,
  getSchedulesByWorkspaceId,
  getCurrentUserRole,
} from "@/data/mockData";
import { format, parse } from "date-fns";
import { BookOpen, Plus, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDialogContext from "@/hooks/Dialog";
import { SemesterContext } from "@/context/SemesterProvider";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Group and sort schedules by day, then by time
function useGroupedSchedules(workspaceId: string, semester: 1 | 2) {
  const schedules = getSchedulesByWorkspaceId(workspaceId, semester);
  return useMemo(() => {
    // { [dayIdx]: Array<{ subjectName, time, schedule }> }
    const grouped: Record<
      number,
      { subjectName: string; time: string; schedule: any }[]
    > = {};
    for (let i = 0; i < 7; i++) grouped[i] = [];
    schedules.forEach((sched) => {
      grouped[sched.dayOfWeek].push({
        subjectName: sched.subjectName,
        time: sched.timeOfDay,
        schedule: sched,
      });
    });
    // Sort each day's subjects by time
    for (let i = 0; i < 7; i++) {
      grouped[i].sort((a, b) => a.time.localeCompare(b.time));
    }
    return grouped;
  }, [schedules]);
}

// Helper to format "HH:mm" to "h:mm AM/PM"
function formatTime12h(time: string) {
  const parsed = parse(time, "HH:mm", new Date());
  return format(parsed, "h:mm a");
}

function SubjectsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const semesterContext = useContext(SemesterContext);
  const semester = semesterContext?.semester ?? 1;

  const [activeTab, setActiveTab] = useState<"subjects" | "schedule">(
    "subjects"
  );
  const { openDialog, closeDialog } = useDialogContext();
  const schedulesByDay = useGroupedSchedules(workspaceId, semester);
  const currentUserRole = getCurrentUserRole(workspaceId);
  const canManageSubjects =
    currentUserRole === "admin" || currentUserRole === "co";

  const subjects = getSubjectsByWorkspaceId(workspaceId, semester);

  const handleAddSubject = () => {
    openDialog("UPSERT_SUBJECT");
  };

  const handleAddSchedule = () => {
    openDialog("UPSERT_SCHEDULE", {
      subjects,
    });
  };

  const handleEditSubject = (subject: any) => {
    openDialog("UPSERT_SUBJECT", {
      initialData: {
        id: subject.id,
        name: subject.name,
        code: subject.code,
        instructor: subject.instructor,
      },
    });
  };

  const handleEditSchedule = (schedule: any) => {
    openDialog("UPSERT_SCHEDULE", {
      subjects,
      initialData: {
        id: schedule.id,
        subjectId: schedule.subjectId,
        dayOfWeek: schedule.dayOfWeek,
        timeOfDay: schedule.timeOfDay,
      },
    });
  };

  const handleDeleteSubject = (subject: any) => {
    openDialog("CONFIRM_ACTION", {
      title: "Delete Subject?",
      description: `Are you sure you want to delete the subject "${subject.name}"?`,
      actionButtonVariant: "destructive",
      actionButtonText: "Delete",
      handleAction: closeDialog,
    });
  };

  const handleDeleteSchedule = (subjectName: string) => {
    openDialog("CONFIRM_ACTION", {
      title: "Delete Schedule?",
      description: `Are you sure you want to delete the schedule for "${subjectName}"?`,
      actionButtonVariant: "destructive",
      actionButtonText: "Delete",
      handleAction: closeDialog,
    });
  };

  const renderSubjectsTab = () => (
    <div className="space-y-4">
      {subjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <BookOpen className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">
            No subjects yet
          </h3>
          <p className="text-slate-600 mb-6 max-w-sm mx-auto">
            No subjects have been added yet.
          </p>
        </div>
      ) : (
        subjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 hover:shadow-md hover:border-blue-200 transition-all relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-800">{subject.name}</h3>
                  <div className="mt-1 flex items-baseline gap-2 text-sm text-slate-600">
                    <span className="font-mono text-[0.95em]">
                      {subject.code}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>{subject.instructor}</span>
                  </div>
                </div>
              </div>

              {/* Actions Menu - Only show if user can manage subjects */}
              {canManageSubjects && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onSelect={() => handleEditSubject(subject)}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Subject
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleDeleteSubject(subject)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                        <span className="hover:text-red-600">
                          Delete Subject
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderScheduleTab = () => (
    <div className="space-y-4">
      {DAYS.map((day, dayIdx) => (
        <div key={day}>
          <h3 className="font-medium text-slate-800 mb-2">{day}</h3>
          <div className="space-y-1 ml-4">
            {schedulesByDay[dayIdx] && schedulesByDay[dayIdx].length === 0 ? (
              <div className="text-slate-400 text-sm italic py-1">
                No classes scheduled
              </div>
            ) : (
              schedulesByDay[dayIdx]?.map((sched, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-slate-600 min-w-[60px]">
                      {formatTime12h(sched.time)}
                    </span>
                    <span className="text-slate-800">{sched.subjectName}</span>
                  </div>

                  {/* Actions Menu - Only show if user can manage subjects */}
                  {canManageSubjects && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onSelect={() => handleEditSchedule(sched.schedule)}
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit Schedule
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() =>
                              handleDeleteSchedule(sched.subjectName)
                            }
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                            <span className="hover:text-red-600">
                              Delete Schedule
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Subjects</h1>
        {canManageSubjects && (
          <Button
            onClick={
              activeTab === "subjects" ? handleAddSubject : handleAddSchedule
            }
          >
            <Plus className="w-4 h-4" />
            {activeTab === "subjects" ? "Add Subject" : "Add Schedule"}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("subjects")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "subjects"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Subjects
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "schedule"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Schedule
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "subjects" ? renderSubjectsTab() : renderScheduleTab()}
      </div>
    </div>
  );
}

export default SubjectsPage;
