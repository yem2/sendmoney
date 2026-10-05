/**
 * Logger minimal structuré (JSON) — remplaçable par pino/winston en prod.
 *
 * RÈGLE DE SÉCURITÉ : ne jamais logger de numéro de carte, CVV, mot de
 * passe, jeton d'authentification complet, ou secret de webhook.
 * `redact()` ci-dessous aide à s'en souvenir pour les objets de paiement.
 */
const SENSITIVE_KEYS = ["cardNumber", "cvv", "password", "secret", "token", "authorization"];

export function redact(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  for (const key of Object.keys(clone)) {
    if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s))) {
      clone[key] = "[REDACTED]";
    } else if (typeof clone[key] === "object") {
      clone[key] = redact(clone[key]);
    }
  }
  return clone;
}

function log(level, message, meta = {}) {
  console.log(JSON.stringify({ level, message, meta: redact(meta), time: new Date().toISOString() }));
}

export const logger = {
  info: (message, meta) => log("info", message, meta),
  warn: (message, meta) => log("warn", message, meta),
  error: (message, meta) => log("error", message, meta),
};
