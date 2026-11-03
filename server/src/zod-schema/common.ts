import * as z from "zod";

export const semesterSchema = z.union([z.literal(1), z.literal(2)]);

export const semesterQuerySchema = z.object({ semester: z.coerce.number().int() });
