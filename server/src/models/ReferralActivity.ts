import mongoose, { Document, Model } from "mongoose";

export interface IReferralActivity extends Document {
  referrerClerkUserId: string;
  referredClerkUserId: string;
  creditsAwarded: number;
  activityDate: Date;
}

const ReferralActivitySchema = new mongoose.Schema<IReferralActivity>({
  referrerClerkUserId: { type: String, required: true },
  referredClerkUserId: { type: String, required: true },
  creditsAwarded: { type: Number, required: true },
  activityDate: { type: Date, default: Date.now },
});

const ReferralActivity: Model<IReferralActivity> = mongoose.models.ReferralActivity as Model<IReferralActivity> || mongoose.model<IReferralActivity>("ReferralActivity", ReferralActivitySchema);
export default ReferralActivity;