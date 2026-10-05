import { ValidationError } from "../services/paymentService.js";
import { logger } from "../utils/logger.js";

/**
 * Gestionnaire d'erreurs central. Règle de sécurité : ne jamais renvoyer
 * `err.stack`, un message brut de librairie tierce, ou tout détail interne
 * au client — seulement un message générique + un identifiant de
 * corrélation pour retrouver l'erreur complète dans les logs serveur.
 */
export function errorHandler(err, req, res, _next) {
  const correlationId = req.id || Math.random().toString(36).slice(2, 10);

  logger.error("Erreur non gérée", {
    correlationId,
    path: req.path,
    message: err.message,
  });

  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message, correlationId });
  }

  res.status(500).json({
    error: "Une erreur interne est survenue. Contacte le support avec ce code.",
    correlationId,
  });
}
