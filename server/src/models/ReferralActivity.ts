// server/src/models/ReferralActivity.ts (Optional - for detailed logging)
import mongoose, { Document, Model } from "mongoose";

export interface IReferralActivity extends Document {
  referrerId: string; // clerkUserId of referrer
  referredId: string; // clerkUserId of referred user
  referralCode: string; // The referral code used
  status: "pending" | "converted"; // pending = signed up, converted = made purchase
  creditsAwarded: number; // Credits awarded in this activity
  createdAt: Date;
  updatedAt: Date;
}

const ReferralActivitySchema = new mongoose.Schema<IReferralActivity>(
  {
    referrerId: { 
      type: String, 
      required: true,
      index: true 
    },
    referredId: { 
      type: String, 
      required: true,
      index: true 
    },
    referralCode: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["pending", "converted"],
      default: "pending",
      index: true 
    },
    creditsAwarded: { 
      type: Number, 
      default: 0 
    },
  },
  { 
    timestamps: true 
  }
);

const ReferralActivity: Model<IReferralActivity> = 
  mongoose.models.ReferralActivity as Model<IReferralActivity> || 
  mongoose.model<IReferralActivity>("ReferralActivity", ReferralActivitySchema);

export default ReferralActivity;
