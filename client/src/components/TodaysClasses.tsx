import { useGetSchedules } from "@/hooks";
import { formatTime12h } from "@/utils";
import { format } from "date-fns";

function TodaysClasses({ className = "" }: { className?: string }) {
  const { data: schedules } = useGetSchedules();

  const now = new Date();
  const today = format(now, "EEEE").toLowerCase();
  const currentTime = format(now, "HH:mm:ss");

  const todaysClasses = (schedules ?? [])
    .filter((schedule) => schedule.dayOfWeek === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // highlight the class that is ongoing, or else the next one
  const highlightedId = todaysClasses.find(
    (schedule) => schedule.endTime > currentTime
  )?.id;

  return (
    <section
      className={`rounded-[18px] border border-line bg-blue-50 px-5 pt-5 pb-3 ${className}`}
    >
      <div className="flex items-baseline justify-between gap-3 pb-2">
        <h2 className="text-base font-extrabold text-slate-800">
          Today's classes
        </h2>
        <span className="text-xs font-semibold text-slate-600">
          {format(now, "EEE, MMM d")}
        </span>
      </div>

      {todaysClasses.length ? (
        <ul>
          {todaysClasses.map((schedule) => (
            <li key={schedule.id} className="flex items-stretch gap-3.5 py-2.5">
              <span
                className={`w-1 shrink-0 rounded-full ${
                  schedule.id === highlightedId ? "bg-blue-600" : "bg-blue-200"
                }`}
              />
              <span className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-bold text-slate-800">
                  {schedule.subjectName}
                </span>
                <span className="text-xs text-slate-600">
                  {formatTime12h(schedule.startTime)} –{" "}
                  {formatTime12h(schedule.endTime)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-3 text-sm text-slate-600">No classes today.</p>
      )}
    </section>
  );
}

export default TodaysClasses;
