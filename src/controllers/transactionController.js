import { query } from "../config/db.js";

const FAKE_RATES = { "XOF-XAF": 0.6574, "EUR-USD": 1.0704, "NGN-XOF": 0.5925 };
const FEE_RATE = 0.015;

export async function getExchangeRate(req, res, next) {
  try {
    const { from, to } = req.query;
    const rate = FAKE_RATES[`${from}-${to}`] || 1; // TODO: brancher un vrai fournisseur de taux
    res.json({ rate });
  } catch (err) {
    next(err);
  }
}

export async function listTransactions(req, res, next) {
  try {
    const { rows } = await query(
      "SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function createTransaction(req, res, next) {
  try {
    const { beneficiaryId, fromCountry, toCountry, sentAmount, sentCurrency, receivedCurrency, idempotencyKey } = req.body;

    if (!fromCountry || !toCountry || !sentAmount || sentAmount <= 0) {
      return res.status(400).json({ error: "Données de transfert invalides." });
    }

    // Idempotence : un retry avec la même clé renvoie la transaction existante
    // plutôt que d'en recréer une (évite les doublons en cas de double clic/retry réseau).
    if (idempotencyKey) {
      const existing = await query("SELECT * FROM transactions WHERE idempotency_key = $1", [idempotencyKey]);
      if (existing.rows[0]) return res.status(200).json(existing.rows[0]);
    }

    const rate = FAKE_RATES[`${sentCurrency}-${receivedCurrency}`] || 1;
    const fee = Math.round(sentAmount * FEE_RATE * 100) / 100;
    const receivedAmount = Math.round((sentAmount - fee) * rate * 100) / 100;

    const { rows } = await query(
      `INSERT INTO transactions
         (user_id, beneficiary_id, from_country, to_country, sent_amount, sent_currency, received_amount, received_currency, fee, status, idempotency_key)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending',$10)
       RETURNING *`,
      [req.user.id, beneficiaryId || null, fromCountry, toCountry, sentAmount, sentCurrency, receivedAmount, receivedCurrency, fee, idempotencyKey || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function getDashboardStats(req, res, next) {
  try {
    const [sent, received, beneficiaries] = await Promise.all([
      query("SELECT COUNT(*) FROM transactions WHERE user_id = $1", [req.user.id]),
      query("SELECT COUNT(*) FROM transactions WHERE beneficiary_id IN (SELECT id FROM beneficiaries WHERE user_id = $1)", [req.user.id]),
      query("SELECT COUNT(*) FROM beneficiaries WHERE user_id = $1", [req.user.id]),
    ]);
    res.json({
      balance: 0, // pas de vrai solde tant qu'aucun fournisseur de paiement réel n'est branché
      sentCount: Number(sent.rows[0].count),
      receivedCount: Number(received.rows[0].count),
      beneficiariesCount: Number(beneficiaries.rows[0].count),
    });
  } catch (err) {
    next(err);
  }
}
