// server/src/routes/api.ts
import { Router } from "express";
import { createOrUpdateProfile, purchase } from "../controllers/referralController.js";
import { requireAuth } from "../middlewares/clerkAuth.js";

const router = Router();

router.post("/profile", createOrUpdateProfile);
router.post("/purchase", requireAuth, purchase);

export default router;
