"use client";
import { useMemo, useState } from "react";
import { mockSchedules, mockSubjects } from "@/data/mockData";
import { format, parse } from "date-fns";
import {
  BookOpen,
  Calendar,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDialogContext from "@/hooks/Dialog";

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
function useGroupedSchedules() {
  return useMemo(() => {
    // { [dayIdx]: Array<{ subjectName, time }> }
    const grouped: Record<number, { subjectName: string; time: string }[]> = {};
    for (let i = 0; i < 7; i++) grouped[i] = [];
    mockSchedules.forEach((sched) => {
      const subject = mockSubjects.find((s) => s.id === sched.subjectId);
      if (subject) {
        grouped[sched.dayOfWeek].push({
          subjectName: subject.name,
          time: sched.timeOfDay,
        });
      }
    });
    // Sort each day's subjects by time
    for (let i = 0; i < 7; i++) {
      grouped[i].sort((a, b) => a.time.localeCompare(b.time));
    }
    return grouped;
  }, []);
}

// Helper to format "HH:mm" to "h:mm AM/PM"
function formatTime12h(time: string) {
  // Parse as today with the given time
  const parsed = parse(time, "HH:mm", new Date());
  return format(parsed, "h:mm a");
}

function SubjectsPage() {
  const [activeTab, setActiveTab] = useState<"subjects" | "schedule">(
    "subjects"
  );
  const { openDialog } = useDialogContext();
  const schedulesByDay = useGroupedSchedules();

  const handleAddSubject = () => {
    openDialog("UPSERT_SUBJECT", {
      // Add any data you need to pass to the dialog
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

  // const handleDeleteSubject = (subject: any) => {
  //   openDialog("CONFIRM_DELETE", {
  //     type: "subject",
  //     id: subject.id,
  //     name: subject.name,
  //   });
  // };

  const renderSubjectsTab = () => (
    <div className="space-y-4">
      {mockSubjects.map((subject) => (
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

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={() => handleEditSubject(subject)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Subject
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                    <span className="hover:text-red-600">Delete Subject</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
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
                <div key={idx} className="flex items-center gap-3 py-1">
                  <span className="font-mono text-sm text-slate-600 min-w-[60px]">
                    {formatTime12h(sched.time)}
                  </span>
                  <span className="text-slate-800">{sched.subjectName}</span>
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
        <Button onClick={handleAddSubject}>
          <Plus className="w-4 h-4" />
          Add Subject
        </Button>
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
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Subjects
            </div>
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "schedule"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule
            </div>
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
