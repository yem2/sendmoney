import "dotenv/config";

/**
 * Centralise et valide les variables d'environnement au démarrage.
 * Échoue vite et bruyamment si une clé critique manque, plutôt que de
 * planter silencieusement plus tard en plein traitement d'un paiement.
 */
const REQUIRED = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "FLW_SECRET_KEY",
  "FLW_WEBHOOK_HASH",
];

const missing = REQUIRED.filter((key) => !process.env[key] || process.env[key].includes("remplace_moi"));
if (missing.length) {
  // En développement on avertit ; en production on bloque le démarrage.
  const message = `Variables d'environnement manquantes ou non configurées : ${missing.join(", ")}`;
  if (process.env.NODE_ENV === "production") {
    throw new Error(message);
  } else {
    console.warn(`⚠️  ${message} (service lancé en mode dégradé, paiements réels indisponibles)`);
  }
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  flutterwave: {
    secretKey: process.env.FLW_SECRET_KEY,
    webhookHash: process.env.FLW_WEBHOOK_HASH,
  },
  databaseUrl: process.env.DATABASE_URL,
};
