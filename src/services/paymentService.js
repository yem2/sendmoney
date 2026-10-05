import { v4 as uuid } from "uuid";
import { StripeProvider } from "../providers/stripeProvider.js";
import { FlutterwaveProvider } from "../providers/flutterwaveProvider.js";
import * as paymentRepository from "../db/paymentRepository.js";
import { logger } from "../utils/logger.js";

const PROVIDERS = {
  stripe: new StripeProvider(),
  flutterwave: new FlutterwaveProvider(),
};

const MAX_AMOUNT = 10_000_000; // garde-fou anti-erreur de saisie / abus — ajuste selon ta politique

/**
 * Choisit automatiquement le fournisseur adapté selon le mode de réception
 * demandé. Centraliser ce choix ici évite de disperser la logique métier
 * dans les contrôleurs.
 */
function selectProvider(receptionMode) {
  if (receptionMode === "mobile_money") return PROVIDERS.flutterwave;
  if (receptionMode === "card" || receptionMode === "bank_transfer") return PROVIDERS.stripe;
  throw new ValidationError(`Mode de réception non supporté : ${receptionMode}`);
}

export class ValidationError extends Error {}

function validatePaymentRequest({ amount, currency, receptionMode }) {
  if (!amount || typeof amount !== "number" || amount <= 0) {
    throw new ValidationError("Montant invalide.");
  }
  if (amount > MAX_AMOUNT) {
    throw new ValidationError("Montant supérieur au plafond autorisé.");
  }
  if (!currency || typeof currency !== "string" || currency.length !== 3) {
    throw new ValidationError("Devise invalide.");
  }
  if (!receptionMode) {
    throw new ValidationError("Mode de réception requis.");
  }
}

/**
 * Point d'entrée unique pour initier un paiement, quel que soit le
 * fournisseur sous-jacent. Garantit l'idempotence : un même
 * `idempotencyKey` (envoyé par le frontend, ex. généré à l'affichage du
 * récapitulatif) ne peut jamais déclencher deux débits.
 */
export async function initiatePayment({ userId, amount, currency, receptionMode, customerPhone, metadata, idempotencyKey }) {
  validatePaymentRequest({ amount, currency, receptionMode });

  const key = idempotencyKey || uuid();
  const existing = await paymentRepository.findByIdempotencyKey(key);
  if (existing) {
    logger.info("Paiement déjà initié pour cette clé d'idempotence — renvoi du résultat existant", { key });
    return existing;
  }

  const provider = selectProvider(receptionMode);

  const record = {
    id: uuid(),
    idempotencyKey: key,
    provider: provider.name,
    userId,
    amount,
    currency,
    status: "initiating",
    createdAt: new Date().toISOString(),
  };
  await paymentRepository.create(record);

  try {
    const result = await provider.initiatePayment({
      amount,
      currency,
      idempotencyKey: key,
      customerPhone,
      metadata: { ...metadata, userId },
    });

    record.providerRef = result.providerRef;
    record.status = result.status;
    record.redirectUrl = result.redirectUrl;
    record.clientSecret = result.clientSecret;
    await paymentRepository.create(record); // mock : réécrit l'entrée avec les infos fournisseur

    logger.info("Paiement initié", { provider: provider.name, providerRef: result.providerRef, idempotencyKey: key });
    return record;
  } catch (err) {
    await paymentRepository.updateStatus(key, "failed");
    logger.error("Échec d'initiation du paiement", { provider: provider.name, error: err.message });
    throw err;
  }
}

/**
 * Traite un événement webhook déjà vérifié (signature validée par le
 * contrôleur avant d'arriver ici) et met à jour le statut du paiement.
 */
export async function handleProviderEvent(providerName, event) {
  const payment = await paymentRepository.findByProviderRef(event.providerRef);
  if (!payment) {
    logger.warn("Webhook reçu pour un paiement inconnu", { providerName, providerRef: event.providerRef });
    return null;
  }
  await paymentRepository.updateStatus(payment.idempotencyKey, event.status);
  logger.info("Statut de paiement mis à jour via webhook", { providerName, status: event.status, providerRef: event.providerRef });

  // Point d'extension : déclencher ici la suite du transfert (notification
  // utilisateur, création de la transaction smarthr/sendmoney, etc.)
  // uniquement quand event.status === "succeeded".
  return payment;
}

export function getProvider(name) {
  const provider = PROVIDERS[name];
  if (!provider) throw new ValidationError(`Fournisseur inconnu : ${name}`);
  return provider;
}
