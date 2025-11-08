import { Document, Model } from "mongoose";
export interface IUser extends Document {
    clerkUserId: string;
    email?: string;
    name?: string;
    referralCode: string;
    referredBy?: string | null;
    credits: number;
    hasPurchased: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const User: Model<IUser>;
export default User;
//# sourceMappingURL=User.d.ts.map