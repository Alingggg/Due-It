"use client";
import { useMemo, useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import useDialogContext from "@/hooks/Dialog";
import {
  useGetUserWorkspace,
  useGetUserWorkspaceRole,
} from "@/hooks/Workspace";
import { useGetSubjects } from "@/hooks/Subject";
import { useGetSchedules } from "@/hooks/Schedule";
import { SemesterSchedule } from "@/types/Schedule";
import { Database } from "@/types/supabase";
import LoadingPage from "@/components/LoadingPage";
import SubjectCard from "@/components/SubjectCard";
import ScheduleItem from "@/components/ScheduleItem";
import useSemesterContext from "@/hooks/Semester";

type DaysOfWeek = Database["public"]["Enums"]["day_of_week"];

const DAYS: DaysOfWeek[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

// Group and sort schedules by day, then by time
function useGroupedSchedules(schedules: SemesterSchedule[]) {
  return useMemo(() => {
    // grouped: { [day in DaysOfWeek]: Array<{ subjectName: string; time: string; schedule: SemesterSchedule }> }
    const grouped: Record<
      DaysOfWeek,
      { subjectName: string; schedule: SemesterSchedule }[]
    > = DAYS.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {} as Record<DaysOfWeek, { subjectName: string; schedule: SemesterSchedule }[]>);

    schedules.forEach((sched) => {
      grouped[sched.dayOfWeek].push({
        subjectName: sched.subjectName,
        schedule: sched,
      });
    });

    DAYS.forEach((day) => {
      grouped[day].sort((a, b) =>
        a.schedule.startTime.localeCompare(b.schedule.startTime)
      );
    });
    return grouped;
  }, [schedules]);
}

function SubjectsPage() {
  const [activeTab, setActiveTab] = useState<"subjects" | "schedule">(
    "subjects"
  );
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetUserWorkspace();
  const workspaceId = workspace?.id!;
  const { semester } = useSemesterContext();
  const { openDialog } = useDialogContext();
  const { data: currentUserRole, isLoading: isLoadingUserRole } =
    useGetUserWorkspaceRole();
  const { data: schedules, isLoading: isLoadingSchedules } = useGetSchedules();
  const schedulesByDay = useGroupedSchedules(schedules ?? []);
  const { data: subjects, isLoading: isLoadingSubjects } = useGetSubjects();
  const canManageSubjects =
    currentUserRole === "admin" || currentUserRole === "co-admin";
  const isPageLoading =
    isLoadingWorkspace ||
    isLoadingUserRole ||
    isLoadingSubjects ||
    isLoadingSchedules;

  function handleAddSubject() {
    openDialog("UPSERT_SUBJECT", { semester, workspaceId });
  }
  function handleAddSchedule() {
    openDialog("UPSERT_SCHEDULE", {
      subjects,
    });
  }

  function renderSubjectsTab() {
    const sortedSubjects = subjects
      ? [...subjects].sort((a, b) => a.name.localeCompare(b.name))
      : [];

    return (
      <div className="space-y-4">
        {sortedSubjects.length === 0 ? (
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
          sortedSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              canManage={canManageSubjects}
            />
          ))
        )}
      </div>
    );
  }

  function renderScheduleTab() {
    return (
      <div className="space-y-4">
        {DAYS.map((day) => (
          <div key={day}>
            <h3 className="font-medium text-slate-800 mb-2 capitalize">
              {day}
            </h3>
            <div className="space-y-1 ml-4">
              {schedulesByDay[day] && schedulesByDay[day].length === 0 ? (
                <div className="text-slate-400 text-sm italic py-1">
                  No classes scheduled
                </div>
              ) : (
                schedulesByDay[day]?.map((sched, idx) => (
                  <ScheduleItem
                    key={idx}
                    schedule={sched.schedule}
                    subjectName={sched.subjectName}
                    canManage={canManageSubjects}
                    subjects={subjects ?? []}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isPageLoading) {
    return <LoadingPage message="Loading subjects and schedules..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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

      <div>
        {activeTab === "subjects" ? renderSubjectsTab() : renderScheduleTab()}
      </div>
    </div>
  );
}

export default SubjectsPage;
