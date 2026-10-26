import type { Request, Response } from "express";
import { authService } from "../services/index.ts";
import { loginSchema, profileSchema, registerSchema } from "../zod-schema/index.ts";
import { TOKEN_COOKIE, signToken, tokenCookieOptions } from "../utils/index.ts";

export async function register(req: Request, res: Response) {
  await authService.register(registerSchema.parse(req.body));

  res.status(201).end();
}

export async function login(req: Request, res: Response) {
  const user = await authService.login(loginSchema.parse(req.body));

  res.cookie(TOKEN_COOKIE, signToken(user.id), tokenCookieOptions);
  res.status(204).end();
}

export function logout(_req: Request, res: Response) {
  const { maxAge, ...options } = tokenCookieOptions;
  res.clearCookie(TOKEN_COOKIE, options);
  res.status(204).end();
}

export async function getMe(req: Request, res: Response) {
  res.json(await authService.getMe(req.userId));
}

export async function updateMe(req: Request, res: Response) {
  const data = profileSchema.parse(req.body);

  res.json(await authService.updateMe(req.userId, data));
}
