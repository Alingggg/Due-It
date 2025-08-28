"use client";
import { useMemo } from "react";
import { mockSchedules, mockSubjects } from "@/data/mockData";
import { format, parse } from "date-fns";

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

function SchedulePage() {
  const schedulesByDay = useGroupedSchedules();

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0 py-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Weekly Schedule
      </h1>
      <div className="space-y-8">
        {DAYS.map((day, dayIdx) => (
          <div key={day} className="space-y-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-slate-800 pr-4 whitespace-nowrap">
                {day}
              </h2>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>
            <div className="space-y-3">
              {schedulesByDay[dayIdx] && schedulesByDay[dayIdx].length === 0 ? (
                <div className="text-slate-400 text-sm italic pl-2">
                  No schedule
                </div>
              ) : (
                schedulesByDay[dayIdx]?.map((sched, idx) => (
                  <div key={idx} className="flex items-center gap-2 pl-2">
                    <span className="font-mono text-blue-600 min-w-[56px]">
                      {formatTime12h(sched.time)}
                    </span>
                    <span className="text-slate-700 font-medium">
                      {sched.subjectName}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SchedulePage;
