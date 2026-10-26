import { UserModel } from "../models/index.ts";
import type { LoginInput, ProfileInput, RegisterInput } from "../types/index.ts";
import { HttpError } from "../utils/index.ts";

export async function register({ password, ...data }: RegisterInput) {
  if (await UserModel.exists({ email: data.email })) {
    throw new HttpError(409, "Email already registered");
  }

  const passwordHash = await Bun.password.hash(password);
  await UserModel.create({ ...data, passwordHash });
}

// returns the user when the credentials match
export async function login({ email, password }: LoginInput) {
  const user = await UserModel.findOne({ email }).select("+passwordHash");

  if (!user || !(await Bun.password.verify(password, user.passwordHash))) {
    throw new HttpError(401, "Invalid email or password");
  }

  return user;
}

export async function getMe(userId: string) {
  const user = await UserModel.findById(userId);

  if (!user) throw new HttpError(401, "Not authenticated");

  return user;
}

export function updateMe(userId: string, data: ProfileInput) {
  return UserModel.findByIdAndUpdate(userId, data, {
    returnDocument: "after",
    runValidators: true,
  });
}
