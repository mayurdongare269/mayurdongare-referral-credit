// server/src/routes/api.ts
import { Router } from "express";
import { requireAuth } from "../middlewares/clerkAuth.js";
import { createOrUpdateProfile, purchase, getDashboard } from "../controllers/referralController.js";

const router = Router();

// Public route - create/update user profile after Clerk signup
router.post("/profile", createOrUpdateProfile);

// Protected routes - require authentication
router.post("/purchase", requireAuth, purchase);
router.get("/dashboard", requireAuth, getDashboard);

export default router;