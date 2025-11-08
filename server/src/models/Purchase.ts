// server/src/models/Purchase.ts
import mongoose, { Document, Model } from "mongoose";

export interface IPurchase extends Document {
  clerkUserId: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  creditsEarned: number;
  purchaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseSchema = new mongoose.Schema<IPurchase>(
  {
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
  },
  { 
    timestamps: true 
  }
);

// Compound index for efficient queries
PurchaseSchema.index({ clerkUserId: 1, purchaseDate: -1 });

const Purchase: Model<IPurchase> = mongoose.models.Purchase as Model<IPurchase> || mongoose.model<IPurchase>("Purchase", PurchaseSchema);
export default Purchase;
