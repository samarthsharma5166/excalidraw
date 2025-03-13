// import { Request } from "express";
import { z } from "zod";

export const createUser = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
});

export const createRoomSchema = z.object({
  name: z.string().min(3, "Room name must be at least 3 characters"),
});

// interface AuthRequest extends Request {
//   user?: {
//     id: string;
//     email: string;
//   };
// }

// export type { AuthRequest };