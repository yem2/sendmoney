import { query } from "../config/db.js";

export async function listUsers(_req, res, next) {
  try {
    const { rows } = await query("SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// Réservé super_admin (voir routes/adminRoutes.js) : promouvoir/rétrograder
// un rôle est plus sensible qu'activer/désactiver un compte.
export async function setUserRole(req, res, next) {
  try {
    const { role } = req.body;
    if (!["user", "admin", "super_admin"].includes(role)) {
      return res.status(400).json({ error: "Rôle invalide." });
    }
    const { rows } = await query(
      "UPDATE users SET role = $1, updated_at = now() WHERE id = $2 RETURNING id, name, email, role, status",
      [role, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Utilisateur introuvable." });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function setUserStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ error: "Statut invalide." });
    }
    const { rows } = await query(
      "UPDATE users SET status = $1, updated_at = now() WHERE id = $2 RETURNING id, name, email, role, status",
      [status, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Utilisateur introuvable." });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}
