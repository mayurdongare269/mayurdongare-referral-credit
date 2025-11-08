import type { Request, Response } from "express";
/**
 * Create or update user profile after Clerk signup
 * Handles referral code generation and referral tracking
 */
export declare const createOrUpdateProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Handle course purchase and credit allocation
 * Uses atomic operations to prevent double-crediting
 *
 * Credit Rules:
 * - First purchase: +2 credits (for everyone)
 * - If referred: +2 additional credits (total 4 for referred user)
 * - Referrer: +2 credits when their referral makes first purchase
 */
export declare const purchase: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Get user dashboard statistics
 * Returns referral code, credits, referred users count, and converted users count
 */
export declare const getDashboard: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Get user's purchased courses
 * Returns list of all courses purchased by the user
 */
export declare const getPurchasedCourses: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=referralController.d.ts.map