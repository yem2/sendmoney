/**
 * Dépôt de données des paiements — implémentation MOCK en mémoire.
 * -------------------------------------------------------------
 * À remplacer par de vraies requêtes SQL/ORM (ex. Prisma, Knex) vers
 * PostgreSQL. Garder cette interface (mêmes noms de fonctions) pour ne
 * rien casser ailleurs.
 *
 * Schéma de table recommandé (payments) :
 *   id UUID PRIMARY KEY,
 *   idempotency_key TEXT UNIQUE NOT NULL,   -- empêche les doublons
 *   provider TEXT NOT NULL,
 *   provider_ref TEXT,
 *   user_id UUID NOT NULL,
 *   amount NUMERIC NOT NULL,
 *   currency TEXT NOT NULL,
 *   status TEXT NOT NULL,                   -- pending|succeeded|failed|refunded
 *   created_at TIMESTAMPTZ DEFAULT now(),
 *   updated_at TIMESTAMPTZ DEFAULT now()
 *
 * Index requis : UNIQUE(idempotency_key), INDEX(provider_ref), INDEX(user_id)
 */
const payments = new Map(); // clé = idempotencyKey

export async function findByIdempotencyKey(key) {
  return payments.get(key) || null;
}

export async function findByProviderRef(providerRef) {
  return [...payments.values()].find((p) => p.providerRef === providerRef) || null;
}

export async function create(payment) {
  payments.set(payment.idempotencyKey, payment);
  return payment;
}

export async function updateStatus(idempotencyKey, status) {
  const payment = payments.get(idempotencyKey);
  if (!payment) return null;
  payment.status = status;
  payment.updatedAt = new Date().toISOString();
  return payment;
}
