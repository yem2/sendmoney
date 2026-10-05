import Stripe from "stripe";
import { PaymentProvider } from "./PaymentProvider.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

/**
 * Fournisseur Stripe — paiements par carte, principalement pour les envois
 * depuis l'Europe/Amérique du Nord.
 *
 * SÉCURITÉ : on n'utilise QUE Stripe Checkout / PaymentIntents côté serveur.
 * Le numéro de carte ne transite JAMAIS par notre backend ni notre
 * frontend — Stripe.js tokenise la carte directement dans le navigateur.
 * Ça nous sort du périmètre PCI-DSS le plus lourd (SAQ A au lieu de SAQ D).
 */
export class StripeProvider extends PaymentProvider {
  constructor() {
    super("stripe");
    this.client = new Stripe(env.stripe.secretKey, { apiVersion: "2024-06-20" });
  }

  async initiatePayment({ amount, currency, idempotencyKey, metadata }) {
    const intent = await this.client.paymentIntents.create(
      {
        amount: Math.round(amount * 100), // Stripe attend des centimes
        currency: currency.toLowerCase(),
        metadata, // ex. { transferId, userId } — jamais de données sensibles
        automatic_payment_methods: { enabled: true },
      },
      { idempotencyKey } // évite les doubles débits en cas de retry réseau
    );

    return {
      providerRef: intent.id,
      status: "pending",
      clientSecret: intent.client_secret, // transmis au frontend pour Stripe.js
    };
  }

  verifyWebhookSignature(rawBody, signatureHeader) {
    try {
      this.client.webhooks.constructEvent(rawBody, signatureHeader, env.stripe.webhookSecret);
      return true;
    } catch (err) {
      logger.warn("Signature webhook Stripe invalide", { error: err.message });
      return false;
    }
  }

  parseWebhookEvent(rawBody, signatureHeader) {
    const event = this.client.webhooks.constructEvent(rawBody, signatureHeader, env.stripe.webhookSecret);
    const intent = event.data.object;
    const statusMap = {
      "payment_intent.succeeded": "succeeded",
      "payment_intent.payment_failed": "failed",
      "payment_intent.canceled": "canceled",
    };
    return {
      providerRef: intent.id,
      status: statusMap[event.type] || "unknown",
      amount: intent.amount / 100,
      currency: intent.currency.toUpperCase(),
      eventType: event.type,
    };
  }

  async refund(providerRef, amount) {
    const refund = await this.client.refunds.create({
      payment_intent: providerRef,
      amount: amount ? Math.round(amount * 100) : undefined,
    });
    return { status: refund.status };
  }
}
