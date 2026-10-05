import { Router } from "express";
import express from "express";
import { stripeWebhook, flutterwaveWebhook } from "../webhooks/webhookController.js";
import { webhookRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// express.raw() : indispensable ici — la signature est calculée sur le
// corps brut. Si express.json() global a déjà parsé le body, la
// vérification de signature échouera toujours (faux négatifs en cascade).
router.post("/webhooks/stripe", webhookRateLimiter, express.raw({ type: "application/json" }), stripeWebhook);
router.post("/webhooks/flutterwave", webhookRateLimiter, express.raw({ type: "application/json" }), flutterwaveWebhook);

export default router;
