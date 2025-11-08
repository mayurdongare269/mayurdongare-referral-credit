// server/src/middlewares/clerkAuth.ts
import { createClerkClient } from "@clerk/clerk-sdk-node";
import type { Request, Response, NextFunction } from "express";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No auth header" });
    const token = authHeader.replace("Bearer ", "");
    const ver = await clerk.verifyToken(token);
    // ver.sub is the clerk user id
    (req as any).clerkUserId = ver.sub;
    next();
  } catch (err) {
    console.error("Auth error", err);
    res.status(401).json({ message: "Unauthorized" });
  }
}
