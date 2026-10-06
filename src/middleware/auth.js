import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * Vérifie un vrai token JWT signé (émis par authController.login).
 * Le payload ne contient jamais le mot de passe ni son hash — seulement
 * id/email/role, le strict nécessaire pour autoriser les requêtes.
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentification requise." });
  }
  try {
    const payload = jwt.verify(authHeader.slice(7), env.jwtSecret);
    req.user = payload; // { id, email, role }
    next();
  } catch {
    return res.status(401).json({ error: "Session invalide ou expirée." });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user?.role)) {
      return res.status(403).json({ error: "Accès refusé pour ce rôle." });
    }
    next();
  };
}

// Raccourcis pratiques
export const requireAdmin = requireRole("admin", "super_admin");
export const requireSuperAdmin = requireRole("super_admin");
