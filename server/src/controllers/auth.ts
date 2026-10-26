import type { Request, Response } from "express";
import { UserModel } from "../models/index.ts";
import { loginSchema, profileSchema, registerSchema } from "../zod-schema/index.ts";
import { TOKEN_COOKIE, signToken, tokenCookieOptions } from "../utils/index.ts";

export async function register(req: Request, res: Response) {
  const { password, ...data } = registerSchema.parse(req.body);

  if (await UserModel.exists({ email: data.email })) {
    res.status(409).json({ message: "Email already registered" });
    return;
  }

  const passwordHash = await Bun.password.hash(password);
  await UserModel.create({ ...data, passwordHash });

  res.status(201).end();
}

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);

  const user = await UserModel.findOne({ email }).select("+passwordHash");

  if (!user || !(await Bun.password.verify(password, user.passwordHash))) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  res.cookie(TOKEN_COOKIE, signToken(user.id), tokenCookieOptions);
  res.status(204).end();
}

export function logout(_req: Request, res: Response) {
  const { maxAge, ...options } = tokenCookieOptions;
  res.clearCookie(TOKEN_COOKIE, options);
  res.status(204).end();
}

export async function getMe(req: Request, res: Response) {
  const user = await UserModel.findById(req.userId);

  if (!user) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  res.json(user);
}

export async function updateMe(req: Request, res: Response) {
  const data = profileSchema.parse(req.body);

  const user = await UserModel.findByIdAndUpdate(req.userId, data, {
    returnDocument: "after",
    runValidators: true,
  });

  res.json(user);
}
