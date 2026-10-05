/**
 * Vérifie que la requête porte un utilisateur authentifié.
 *
 * Ceci est un SQUELETTE : branche ta vraie vérification de session/JWT
 * (ex. `jsonwebtoken.verify(token, process.env.JWT_SECRET)`) à la place
 * du bloc marqué ci-dessous. Ne jamais faire confiance à un `userId`
 * envoyé en clair dans le corps de la requête — toujours le dériver
 * d'un token signé vérifié côté serveur.
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentification requise." });
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    // TODO: remplacer par une vraie vérification, ex. :
    // const payload = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = { id: payload.sub, role: payload.role };
    if (!token) throw new Error("Token vide");
    req.user = { id: "mock-user-id", role: "user" }; // placeholder de démo
    next();
  } catch {
    return res.status(401).json({ error: "Session invalide ou expirée." });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Accès réservé à l'administrateur." });
  }
  next();
}
