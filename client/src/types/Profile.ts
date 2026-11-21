import type * as z from "zod";
import type { ProfileSchema } from "@/zod-schema";

interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

type ProfileInput = z.infer<typeof ProfileSchema>;

export type { Profile, ProfileInput };
