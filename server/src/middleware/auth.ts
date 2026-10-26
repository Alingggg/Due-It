import type { NextFunction, Request, Response } from "express";
import { TOKEN_COOKIE, verifyToken } from "../utils/index.ts";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[TOKEN_COOKIE];

  try {
    req.userId = verifyToken(token);
  } catch {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  next();
}
