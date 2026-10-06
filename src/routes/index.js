import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth, requireAdmin, requireSuperAdmin } from "../middleware/auth.js";
import * as auth from "../controllers/authController.js";
import * as countries from "../controllers/countryController.js";
import * as beneficiaries from "../controllers/beneficiaryController.js";
import * as transactions from "../controllers/transactionController.js";
import * as admin from "../controllers/adminController.js";

const router = Router();

const authRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 }); // anti brute-force login

// --- Auth ---
router.post("/auth/login", authRateLimiter, auth.login);
router.post("/auth/register", authRateLimiter, auth.register);
router.get("/auth/me", requireAuth, auth.me);

// --- Pays ---
router.get("/countries", countries.listCountries);
router.patch("/countries/:code/active", requireAuth, requireAdmin, countries.setCountryActive);

// --- Bénéficiaires (utilisateur connecté) ---
router.get("/beneficiaries", requireAuth, beneficiaries.listBeneficiaries);
router.post("/beneficiaries", requireAuth, beneficiaries.addBeneficiary);
router.delete("/beneficiaries/:id", requireAuth, beneficiaries.deleteBeneficiary);

// --- Transactions (utilisateur connecté) ---
router.get("/exchange-rate", requireAuth, transactions.getExchangeRate);
router.get("/transactions", requireAuth, transactions.listTransactions);
router.post("/transactions", requireAuth, transactions.createTransaction);
router.get("/dashboard/stats", requireAuth, transactions.getDashboardStats);

// --- Admin ---
router.get("/admin/users", requireAuth, requireAdmin, admin.listUsers);
router.patch("/admin/users/:id/status", requireAuth, requireAdmin, admin.setUserStatus);
// Changer un rôle (donner/retirer les droits admin) est réservé super_admin.
router.patch("/admin/users/:id/role", requireAuth, requireSuperAdmin, admin.setUserRole);

export default router;
