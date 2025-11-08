import { Document, Model } from "mongoose";
export interface IReferralActivity extends Document {
    referrerId: string;
    referredId: string;
    referralCode: string;
    status: "pending" | "converted";
    creditsAwarded: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const ReferralActivity: Model<IReferralActivity>;
export default ReferralActivity;
//# sourceMappingURL=ReferralActivity.d.ts.map