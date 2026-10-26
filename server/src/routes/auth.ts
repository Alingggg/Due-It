import { Router } from "express";
import { getMe, login, logout, register, updateMe } from "../controllers/index.ts";
import { requireAuth } from "../middleware/index.ts";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuth, getMe);
authRouter.patch("/me", requireAuth, updateMe);
