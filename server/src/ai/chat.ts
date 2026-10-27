import { ApiError, type Content, type Part } from "@google/genai";
import { UserModel } from "../models/index.ts";
import { workspaceService } from "../services/index.ts";
import { HttpError } from "../utils/index.ts";
import { MODEL, ai } from "./llm.ts";
import { buildSystemPrompt } from "./prompts.ts";
import { geminiTools, runTool } from "./tools/index.ts";

const MAX_STEPS = 8;
const FALLBACK_REPLY = "Sorry, I couldn't finish that. Please try again.";
const PARTIAL_REPLY =
  "Sorry, something went wrong before I could finish. Some of your request may already be done, so please check your workspace before trying again.";
const MUTATING_TOOLS = [
  "create_task",
  "update_task",
  "set_task_completion",
  "create_subject",
  "update_subject",
  "create_schedule",
  "update_schedule",
  "rename_workspace",
  "set_default_semester",
  "set_invite_code_enabled",
];

export async function runChat({
  userId,
  history,
  message,
}: {
  userId: string;
  history: Content[];
  message: string;
}) {
  const user = await UserModel.findById(userId);
  const workspaces = await workspaceService.getMyWorkspaces(userId);

  const contents: Content[] = [...history, { role: "user", parts: [{ text: message }] }];
  const config = {
    systemInstruction: buildSystemPrompt({ userName: user?.firstName ?? "the user", workspaces }),
    tools: geminiTools,
  };
  let dataChanged = false;

  for (let step = 0; step < MAX_STEPS; step++) {
    let response;
    try {
      response = await ai.models.generateContent({ model: MODEL, contents, config });
    } catch (error) {
      console.error("Chat failed:", error);
      if (!dataChanged) {
        if (error instanceof ApiError && error.status === 429) {
          throw new HttpError(
            429,
            "The assistant is getting too many requests. Please try again in a minute.",
          );
        }
        throw new HttpError(503, "The assistant is unavailable right now. Please try again later.");
      }
      contents.push({ role: "model", parts: [{ text: PARTIAL_REPLY }] });
      return { reply: PARTIAL_REPLY, history: contents, dataChanged };
    }
    const content = response.candidates?.[0]?.content;
    if (!content?.parts?.length) break;

    contents.push(content);

    const calls = response.functionCalls;
    if (!calls?.length) {
      return { reply: response.text ?? FALLBACK_REPLY, history: contents, dataChanged };
    }

    const parts: Part[] = [];
    for (const call of calls) {
      const response = await runTool(call.name ?? "", call.args, userId);
      if (MUTATING_TOOLS.includes(call.name ?? "") && !("error" in response)) {
        dataChanged = true;
      }
      parts.push({ functionResponse: { name: call.name, response } });
    }
    contents.push({ role: "user", parts });
  }

  contents.push({ role: "model", parts: [{ text: FALLBACK_REPLY }] });
  return { reply: FALLBACK_REPLY, history: contents, dataChanged };
}
