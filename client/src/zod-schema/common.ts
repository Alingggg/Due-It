import { isValid, parse } from "date-fns";
import * as z from "zod";

function isTime(value: string) {
  return ["HH:mm:ss", "HH:mm"].some((format) =>
    isValid(parse(value, format, new Date()))
  );
}

const TimeSchema = z.string().refine(isTime, {
  error: "Invalid time format (expected HH:mm or HH:mm:ss)",
});

export { TimeSchema };
