import { query } from "../config/db.js";

export async function listCountries(_req, res, next) {
  try {
    const { rows } = await query("SELECT code, name, currency, active FROM countries WHERE active = true ORDER BY name ASC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// Admin : désactiver/réactiver un pays plutôt que le supprimer (garde l'historique des transactions valide).
export async function setCountryActive(req, res, next) {
  try {
    const { code } = req.params;
    const { active } = req.body;
    const { rows } = await query(
      "UPDATE countries SET active = $1 WHERE code = $2 RETURNING code, name, currency, active",
      [Boolean(active), code.toUpperCase()]
    );
    if (!rows[0]) return res.status(404).json({ error: "Pays introuvable." });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}
