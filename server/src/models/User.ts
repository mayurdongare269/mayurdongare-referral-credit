// server/src/models/User.ts
import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  clerkUserId: string; // Clerk's user id
  email?: string;
  name?: string;
  referralCode: string;
  referredBy?: string | null; // referralCode of referrer or clerkUserId (design choice)
  credits: number;
  hasPurchased: boolean;
  createdAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  clerkUserId: { type: String, required: true, unique: true },
  email: String,
  name: String,
  referralCode: { type: String, required: true, unique: true },
  referredBy: { type: String, default: null },
  credits: { type: Number, default: 0 },
  hasPurchased: { type: Boolean, default: false },
}, { timestamps: true });

const User: Model<IUser> = mongoose.models.User as Model<IUser> || mongoose.model<IUser>("User", UserSchema);
export default User;
