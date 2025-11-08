// server/src/models/User.ts
import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  clerkUserId: string; // Clerk's user ID
  email?: string;
  name?: string;
  referralCode: string; // Unique referral code for this user
  referredBy?: string | null; // Referral code of the user who referred them
  credits: number; // Total credits earned
  hasPurchased: boolean; // Whether user has made their first purchase
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    clerkUserId: { 
      type: String, 
      required: true, 
      unique: true,
      index: true 
    },
    email: { 
      type: String,
      index: true 
    },
    name: String,
    referralCode: { 
      type: String, 
      required: true, 
      unique: true,
      index: true 
    },
    referredBy: { 
      type: String, 
      default: null,
      index: true 
    },
    credits: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    hasPurchased: { 
      type: Boolean, 
      default: false,
      index: true 
    },
  },
  { 
    timestamps: true 
  }
);

// Indexes for efficient queries
UserSchema.index({ referredBy: 1, hasPurchased: 1 });

const User: Model<IUser> = mongoose.models.User as Model<IUser> || mongoose.model<IUser>("User", UserSchema);
export default User;
