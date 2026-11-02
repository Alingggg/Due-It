import { format, parse } from "date-fns";

// "HH:mm:ss" -> "h:mm AM/PM"
function formatTime12h(time: string): string {
  return format(parse(time, "HH:mm:ss", new Date()), "h:mm a");
}

export default formatTime12h;
