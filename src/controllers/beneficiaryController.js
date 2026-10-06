import { query } from "../config/db.js";

export async function listBeneficiaries(req, res, next) {
  try {
    const { rows } = await query(
      "SELECT * FROM beneficiaries WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function addBeneficiary(req, res, next) {
  try {
    const { name, country, phone, mode } = req.body;
    if (!name || !country || !mode) return res.status(400).json({ error: "Nom, pays et mode de réception requis." });

    const { rows } = await query(
      `INSERT INTO beneficiaries (user_id, name, country_code, phone, reception_mode)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, name, country.toUpperCase(), phone || null, mode]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23503") return res.status(400).json({ error: "Pays inconnu." });
    next(err);
  }
}

export async function deleteBeneficiary(req, res, next) {
  try {
    // Toujours filtrer par user_id : empêche un utilisateur de supprimer
    // le bénéficiaire de quelqu'un d'autre en devinant un UUID.
    const { rows } = await query(
      "DELETE FROM beneficiaries WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Bénéficiaire introuvable." });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
