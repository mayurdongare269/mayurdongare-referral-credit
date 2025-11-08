// server/src/controllers/referralController.ts
import type { Request, Response } from "express";
import User from "../models/User.js";
import mongoose from "mongoose";

/**
 * Create or update user profile after Clerk signup
 * Handles referral code generation and referral tracking
 */
export const createOrUpdateProfile = async (req: Request, res: Response) => {
  try {
    const { clerkUserId, email, name, referralParam } = req.body;

    if (!clerkUserId) {
      return res.status(400).json({ error: "clerkUserId is required" });
    }

    // Generate unique referral code: "R" + last 6 chars of clerkUserId
    const referralCode = "R" + clerkUserId.slice(-6).toUpperCase();

    // Check if user already exists
    let user = await User.findOne({ clerkUserId });
    
    if (!user) {
      // Validate referral code if provided
      let validReferredBy = null;
      if (referralParam) {
        const referrer = await User.findOne({ referralCode: referralParam });
        if (referrer) {
          validReferredBy = referralParam;
        } else {
          console.log(`Invalid referral code: ${referralParam}`);
        }
      }

      // Create new user
      user = new User({
        clerkUserId,
        email,
        name,
        referralCode,
        referredBy: validReferredBy,
      });
      await user.save();
      console.log(`✅ New user created: ${email} with referral code: ${referralCode}`);
    } else {
      console.log(`User already exists: ${email}`);
    }

    return res.json({ success: true, user });
  } catch (err: any) {
    console.error("Error in createOrUpdateProfile:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};

/**
 * Handle course purchase and credit allocation
 * Uses atomic operations to prevent double-crediting
 * Awards 2 credits to buyer and 2 credits to referrer (if exists)
 */
export const purchase = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { clerkUserId } = req as any;

    // Find user with session for transaction
    const user = await User.findOne({ clerkUserId }).session(session);
    
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ error: "User not found" });
    }

    if (user.hasPurchased) {
      await session.abortTransaction();
      return res.status(400).json({ 
        error: "You have already made your first purchase. Only the first purchase earns credits." 
      });
    }

    // Mark user as purchased and award credits atomically
    await User.findOneAndUpdate(
      { clerkUserId, hasPurchased: false }, // Ensure hasPurchased is still false
      { 
        $set: { hasPurchased: true },
        $inc: { credits: 2 }
      },
      { session }
    );

    console.log(`✅ Purchase completed for user: ${user.email}, awarded 2 credits`);

    // Award credits to referrer if exists
    if (user.referredBy) {
      const referrer = await User.findOneAndUpdate(
        { referralCode: user.referredBy },
        { $inc: { credits: 2 } },
        { session, new: true }
      );

      if (referrer) {
        console.log(`✅ Referrer ${referrer.email} earned 2 credits from ${user.email}'s purchase`);
      }
    }

    await session.commitTransaction();

    // Fetch updated user data
    const updatedUser = await User.findOne({ clerkUserId });

    return res.json({ 
      success: true, 
      message: "Purchase successful! You earned 2 credits!",
      user: updatedUser 
    });
  } catch (err: any) {
    await session.abortTransaction();
    console.error("Error in purchase:", err);
    return res.status(500).json({ error: "Purchase failed", details: err.message });
  } finally {
    session.endSession();
  }
};

/**
 * Get user dashboard statistics
 * Returns referral code, credits, referred users count, and converted users count
 */
export const getDashboard = async (req: Request, res: Response) => {
  try {
    const { clerkUserId } = req as any;

    const user = await User.findOne({ clerkUserId });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Count total users referred by this user
    const referredUsers = await User.countDocuments({ 
      referredBy: user.referralCode 
    });
    
    // Count referred users who have made a purchase (converted)
    const convertedUsers = await User.countDocuments({ 
      referredBy: user.referralCode, 
      hasPurchased: true 
    });

    return res.json({
      success: true,
      data: {
        referralCode: user.referralCode,
        credits: user.credits,
        referredUsers,
        convertedUsers,
        hasPurchased: user.hasPurchased,
        email: user.email,
        name: user.name
      }
    });
  } catch (err: any) {
    console.error("Error in getDashboard:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};