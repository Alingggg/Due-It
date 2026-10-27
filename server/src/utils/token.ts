import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const TOKEN_COOKIE = "token";

export const tokenCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: MAX_AGE_MS,
} as const;

export function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET!, { expiresIn: MAX_AGE_MS / 1000 });
}

export function verifyToken(token: string) {
  const { userId } = jwt.verify(token, JWT_SECRET!) as jwt.JwtPayload;
  if (typeof userId !== "string") throw new Error("Token has no userId");
  return userId;
}
