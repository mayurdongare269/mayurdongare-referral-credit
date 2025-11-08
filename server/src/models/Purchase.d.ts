import { Document, Model } from "mongoose";
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
declare const Purchase: Model<IPurchase>;
export default Purchase;
//# sourceMappingURL=Purchase.d.ts.map