import { logger } from "../utils/logger.js";

export function errorHandler(err, req, res, _next) {
  const correlationId = Math.random().toString(36).slice(2, 10);
  logger.error("Erreur non gérée", { correlationId, path: req.path, message: err.message });
  res.status(500).json({ error: "Erreur interne. Contacte le support avec ce code.", correlationId });
}
