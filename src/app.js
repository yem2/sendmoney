import express from "express";
import helmet from "helmet";
import { randomUUID } from "crypto";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";

const app = express();

// Webhooks d'abord : ils ont besoin du corps BRUT (express.raw, voir
// webhookRoutes.js), donc ils doivent être montés avant express.json()
// global ci-dessous, sans quoi le corps serait déjà consommé/parsé.
app.use("/api", webhookRoutes);

app.use(helmet()); // en-têtes de sécurité (CSP, HSTS, X-Frame-Options, etc.)
app.use(express.json({ limit: "100kb" })); // limite la taille pour limiter le risque de DoS applicatif

// CORS restreint à l'origine du frontend connu — jamais `*` sur des routes de paiement.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", env.corsOrigin);
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Identifiant de corrélation par requête, utile pour tracer une erreur
// signalée par un utilisateur sans exposer de détails sensibles au client.
app.use((req, _res, next) => {
  req.id = randomUUID();
  next();
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api", paymentRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  logger.info(`Service de paiement démarré sur le port ${env.port}`);
});
