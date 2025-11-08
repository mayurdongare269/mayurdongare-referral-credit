import User from "../models/User.js";
import Purchase from "../models/Purchase.js";
import mongoose from "mongoose";
/**
 * Create or update user profile after Clerk signup
 * Handles referral code generation and referral tracking
 */
export const createOrUpdateProfile = async (req, res) => {
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
                }
                else {
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
        }
        else {
            console.log(`User already exists: ${email}`);
        }
        return res.json({ success: true, user });
    }
    catch (err) {
        console.error("Error in createOrUpdateProfile:", err);
        return res.status(500).json({ error: "Server error", details: err.message });
    }
};
/**
 * Handle course purchase and credit allocation
 * Uses atomic operations to prevent double-crediting
 *
 * Credit Rules:
 * - First purchase: +2 credits (for everyone)
 * - If referred: +2 additional credits (total 4 for referred user)
 * - Referrer: +2 credits when their referral makes first purchase
 */
export const purchase = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { clerkUserId } = req;
        const { courseId, courseTitle, coursePrice } = req.body;
        // Validate required fields
        if (!courseId || !courseTitle || !coursePrice) {
            await session.abortTransaction();
            return res.status(400).json({
                error: "Missing required fields: courseId, courseTitle, coursePrice"
            });
        }
        // Find user with session for transaction
        const user = await User.findOne({ clerkUserId }).session(session);
        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ error: "User not found" });
        }
        // Check if user already purchased this specific course
        const existingPurchase = await Purchase.findOne({
            clerkUserId,
            courseId
        }).session(session);
        if (existingPurchase) {
            await session.abortTransaction();
            return res.status(400).json({
                error: "You have already purchased this course."
            });
        }
        // Calculate credits for this user (only for first purchase)
        // Base: 2 credits for first purchase
        // Bonus: +2 credits if they were referred
        const isFirstPurchase = !user.hasPurchased;
        const creditsToAward = isFirstPurchase ? (user.referredBy ? 4 : 2) : 0;
        // Create purchase record
        const purchase = new Purchase({
            clerkUserId,
            courseId,
            courseTitle,
            coursePrice,
            creditsEarned: creditsToAward,
            purchaseDate: new Date()
        });
        await purchase.save({ session });
        // Mark user as purchased and award credits atomically (only for first purchase)
        if (isFirstPurchase) {
            await User.findOneAndUpdate({ clerkUserId, hasPurchased: false }, {
                $set: { hasPurchased: true },
                $inc: { credits: creditsToAward }
            }, { session });
            console.log(`✅ First purchase completed for user: ${user.email}`);
            console.log(`   - Course: ${courseTitle}`);
            console.log(`   - First purchase bonus: 2 credits`);
            if (user.referredBy) {
                console.log(`   - Referral bonus: 2 credits`);
                console.log(`   - Total awarded: 4 credits`);
            }
            else {
                console.log(`   - Total awarded: 2 credits`);
            }
            // Award credits to referrer if exists
            if (user.referredBy) {
                const referrer = await User.findOneAndUpdate({ referralCode: user.referredBy }, { $inc: { credits: 2 } }, { session, new: true });
                if (referrer) {
                    console.log(`✅ Referrer ${referrer.email} earned 2 credits from ${user.email}'s purchase`);
                }
            }
        }
        else {
            console.log(`✅ Additional purchase completed for user: ${user.email}`);
            console.log(`   - Course: ${courseTitle}`);
            console.log(`   - No credits awarded (not first purchase)`);
        }
        await session.commitTransaction();
        // Fetch updated user data
        const updatedUser = await User.findOne({ clerkUserId });
        const message = isFirstPurchase
            ? (user.referredBy
                ? "Purchase successful! You earned 4 credits (2 for first purchase + 2 referral bonus)!"
                : "Purchase successful! You earned 2 credits!")
            : "Purchase successful! (Credits only awarded on first purchase)";
        return res.json({
            success: true,
            message,
            creditsEarned: creditsToAward,
            user: updatedUser,
            purchase
        });
    }
    catch (err) {
        await session.abortTransaction();
        console.error("Error in purchase:", err);
        return res.status(500).json({ error: "Purchase failed", details: err.message });
    }
    finally {
        session.endSession();
    }
};
/**
 * Get user dashboard statistics
 * Returns referral code, credits, referred users count, and converted users count
 */
export const getDashboard = async (req, res) => {
    try {
        const { clerkUserId } = req;
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
    }
    catch (err) {
        console.error("Error in getDashboard:", err);
        return res.status(500).json({ error: "Server error", details: err.message });
    }
};
/**
 * Get user's purchased courses
 * Returns list of all courses purchased by the user
 */
export const getPurchasedCourses = async (req, res) => {
    try {
        const { clerkUserId } = req;
        const purchases = await Purchase.find({ clerkUserId })
            .sort({ purchaseDate: -1 })
            .lean();
        return res.json({
            success: true,
            data: purchases
        });
    }
    catch (err) {
        console.error("Error in getPurchasedCourses:", err);
        return res.status(500).json({ error: "Server error", details: err.message });
    }
};
//# sourceMappingURL=referralController.js.map