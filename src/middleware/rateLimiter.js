import rateLimit from "express-rate-limit";

/**
 * Protège les routes de paiement contre les abus (tentatives de carte
 * volée en boucle, déni de service applicatif). Ajuste les seuils selon
 * ton trafic réel, mais ne les retire jamais en production.
 */
export const paymentRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // 20 tentatives de paiement / IP / fenêtre
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives de paiement. Réessaie plus tard." },
});

export const webhookRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100, // les fournisseurs peuvent envoyer des rafales légitimes
  standardHeaders: true,
  legacyHeaders: false,
});
