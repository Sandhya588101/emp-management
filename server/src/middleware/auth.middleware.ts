
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters.");
  }

  return secret;
}

interface TokenPayload {
  sub: string;
  role: "admin" | "employee";
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authentication token is required.",
    });
    return;
  }

  try {
    const token = authorization.slice(7);
    const decoded = jwt.verify(token, getJwtSecret());

    if (
      typeof decoded === "string" ||
      !decoded.sub ||
      !["admin", "employee"].includes(String(decoded.role))
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
      return;
    }

    const payload = decoded as jwt.JwtPayload & TokenPayload;

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
}

export function authorizeAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user?.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Administrator access is required.",
    });
    return;
  }

  next();
}
