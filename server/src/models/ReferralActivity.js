// server/src/models/ReferralActivity.ts (Optional - for detailed logging)
import mongoose, { Document, Model } from "mongoose";
const ReferralActivitySchema = new mongoose.Schema({
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
}, {
    timestamps: true
});
const ReferralActivity = mongoose.models.ReferralActivity ||
    mongoose.model("ReferralActivity", ReferralActivitySchema);
export default ReferralActivity;
//# sourceMappingURL=ReferralActivity.js.map