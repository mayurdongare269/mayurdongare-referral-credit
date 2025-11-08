// server/src/models/Purchase.ts
import mongoose, { Document, Model } from "mongoose";
const PurchaseSchema = new mongoose.Schema({
    clerkUserId: {
        type: String,
        required: true,
        index: true
    },
    courseId: {
        type: String,
        required: true
    },
    courseTitle: {
        type: String,
        required: true
    },
    coursePrice: {
        type: Number,
        required: true
    },
    creditsEarned: {
        type: Number,
        required: true,
        default: 0
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});
// Compound index for efficient queries
PurchaseSchema.index({ clerkUserId: 1, purchaseDate: -1 });
const Purchase = mongoose.models.Purchase || mongoose.model("Purchase", PurchaseSchema);
export default Purchase;
//# sourceMappingURL=Purchase.js.map