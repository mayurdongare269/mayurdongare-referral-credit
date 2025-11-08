// server/src/middlewares/clerkAuth.ts
import { createClerkClient } from "@clerk/clerk-sdk-node";
// Lazy initialization - only create client when needed
let clerk = null;
function getClerkClient() {
    if (!clerk) {
        const clerkSecretKey = process.env.CLERK_SECRET_KEY;
        if (!clerkSecretKey) {
            console.error("❌ CLERK_SECRET_KEY is not set in environment variables!");
            console.error("Make sure your server/.env file exists and contains:");
            console.error("CLERK_SECRET_KEY=sk_test_xxxxx");
            throw new Error("CLERK_SECRET_KEY is required");
        }
        console.log("✅ Clerk initialized with secret key:", clerkSecretKey.substring(0, 15) + "...");
        clerk = createClerkClient({ secretKey: clerkSecretKey });
    }
    return clerk;
}
export async function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.log("❌ No authorization header provided");
            return res.status(401).json({
                error: "No authorization header",
                message: "Please sign in again"
            });
        }
        const token = authHeader.replace("Bearer ", "");
        if (!token || token === "null" || token === "undefined") {
            console.log("❌ Invalid token:", token);
            return res.status(401).json({
                error: "Invalid token",
                message: "Please sign in again"
            });
        }
        console.log("🔍 Verifying token:", token.substring(0, 20) + "...");
        const clerkClient = getClerkClient();
        const verified = await clerkClient.verifyToken(token);
        console.log("✅ Token verified for user:", verified.sub);
        req.clerkUserId = verified.sub;
        next();
    }
    catch (err) {
        console.error("❌ Auth error:", err.message);
        console.error("Error details:", err);
        res.status(401).json({
            error: "Authentication failed",
            message: "Please sign in again",
            details: err.message
        });
    }
}
//# sourceMappingURL=clerkAuth.js.map