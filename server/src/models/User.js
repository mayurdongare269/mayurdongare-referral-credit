// server/src/models/User.ts
import mongoose, { Document, Model } from "mongoose";
const UserSchema = new mongoose.Schema({
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
}, {
    timestamps: true
});
// Indexes for efficient queries
UserSchema.index({ referredBy: 1, hasPurchased: 1 });
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
//# sourceMappingURL=User.js.map