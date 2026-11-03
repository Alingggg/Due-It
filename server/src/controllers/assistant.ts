import type { Request, Response } from "express";
import { clearHistory, getHistory, runChat, saveHistory } from "../ai/index.ts";
import { chatMessageSchema } from "../zod-schema/index.ts";

export async function sendMessage(req: Request, res: Response) {
  const { message, timeZone } = chatMessageSchema.parse(req.body);

  const history = await getHistory(req.userId);
  const result = await runChat({ userId: req.userId, history, message, timeZone });
  await saveHistory(req.userId, result.history);

  res.json({ reply: result.reply, dataChanged: result.dataChanged });
}

export async function clearChat(req: Request, res: Response) {
  await clearHistory(req.userId);

  res.status(204).end();
}
