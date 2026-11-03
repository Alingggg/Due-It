import * as z from "zod";

function isTimeZone(value: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  timeZone: z.string().refine(isTimeZone, "Invalid time zone").optional(),
});
