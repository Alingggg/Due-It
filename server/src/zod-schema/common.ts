import * as z from "zod";

export const semesterQuerySchema = z.object({ semester: z.coerce.number().int() });
