
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  registerUser,
  loginUser,
  getUserById,
} from "./service.js";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(72),
});

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = registerSchema.parse(req.body);
    const user = await registerUser(input);

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = loginSchema.parse(req.body);
    const result = await loginUser(input);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function currentUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const user = await getUserById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
