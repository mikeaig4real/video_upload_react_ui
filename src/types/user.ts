import { z } from "zod";

const id = z.union([z.string(), z.number()]);
const created_at = z.date().optional();
const updated_at = z.date().optional();
const lastName = z.string().optional();
const firstName = z.string().optional();
const bio = z.string().optional();
const location = z.string().optional();
const website = z.url().optional();
const avatar = z.string().optional();
const email = z.email();
const username = z.string();

export const userSchema = z.object({
  id,
  email,
  username,
  created_at,
  updated_at,
  avatar,
  lastName,
  firstName,
  bio,
  location,
  website,
});
export type User = z.infer<typeof userSchema>;
export type OptionalUser = Partial<User>;

export type UserStateType = {
  user: Pick<User, "id" | "email" | "username"> | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};
