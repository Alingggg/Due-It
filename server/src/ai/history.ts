import type { Content } from "@google/genai";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const TTL_SECONDS = 30 * 60;
const MAX_TURNS = 20;

// prefixed because the Redis database is shared with other apps
const key = (userId: string) => `due-it:chat:${userId}`;

// keeps the last MAX_TURNS user messages and everything after them, so a
// function call is never separated from its response
function trimHistory(history: Content[]) {
  const turnStarts = history.flatMap((content, i) =>
    content.role === "user" && content.parts?.some((part) => part.text) ? [i] : [],
  );
  if (turnStarts.length <= MAX_TURNS) return history;

  return history.slice(turnStarts[turnStarts.length - MAX_TURNS]);
}

export async function getHistory(userId: string) {
  return (await redis.get<Content[]>(key(userId))) ?? [];
}

export async function saveHistory(userId: string, history: Content[]) {
  await redis.set(key(userId), trimHistory(history), { ex: TTL_SECONDS });
}

export async function clearHistory(userId: string) {
  await redis.del(key(userId));
}
