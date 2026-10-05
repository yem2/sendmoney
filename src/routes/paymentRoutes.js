import { Router } from "express";
import { createPayment } from "../controllers/paymentController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { paymentRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/payments", requireAuth, paymentRateLimiter, createPayment);

export default router;
