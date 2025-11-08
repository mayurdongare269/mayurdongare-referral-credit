// server/src/controllers/referralController.ts
import type { Request, Response } from "express";
import User from "../models/User.js";

// Create or update profile when a user signs up (call from frontend after Clerk signup)
export const createOrUpdateProfile = async (req: Request, res: Response) => {
  try {
    const { clerkUserId, email, name, referralParam } = req.body;
    // referralParam is the referral code from query param (optional)
    // generate a unique referralCode, e.g. first 6 chars of clerkUserId uppercase
    const referralCode = "R" + clerkUserId.slice(-6).toUpperCase();

    let user = await User.findOne({ clerkUserId });
    if (!user) {
      user = new User({
        clerkUserId,
        email,
        name,
        referralCode,
        referredBy: referralParam || null,
      });
      await user.save();
    }
    return res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Purchase endpoint: triggers credit allocation only on first purchase
export const purchase = async (req: Request, res: Response) => {
  try {
    const { clerkUserId } = req as any;
    const user = await User.findOne({ clerkUserId });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.hasPurchased) return res.status(400).json({ error: "Already purchased" });

    // mark purchased
    user.hasPurchased = true;
    await user.save();

    // award credits to this user
    user.credits += 2;
    await user.save();

    // award to referrer if present and not already awarded
    if (user.referredBy) {
      const ref = await User.findOne({ referralCode: user.referredBy });
      if (ref) {
        ref.credits += 2;
        await ref.save();
      }
    }

    return res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get user dashboard data
export const getDashboard = async (req: Request, res: Response) => {
  try {
    const { clerkUserId } = req as any;
    const user = await User.findOne({ clerkUserId });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Count referred users
    const referredUsers = await User.countDocuments({ referredBy: user.referralCode });
    
    // Count converted users (who made purchases)
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
        hasPurchased: user.hasPurchased
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};