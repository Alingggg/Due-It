import { Router } from "express";
import { clearChat, sendMessage } from "../controllers/index.ts";
import { requireAuth } from "../middleware/index.ts";

export const assistantRouter = Router();

assistantRouter.use(requireAuth);

assistantRouter.post("/messages", sendMessage);
assistantRouter.delete("/messages", clearChat);
