import type * as z from "zod";
import type { CodeSchema } from "@/zod-schema";

interface Code {
  workspaceId: string;
  code: string;
  enabled: boolean;
  updatedAt: string;
}

type CodeInput = z.infer<typeof CodeSchema>;

export type { Code, CodeInput };
