import axios from "axios";
import crypto from "crypto";
import { PaymentProvider } from "./PaymentProvider.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

const BASE_URL = "https://api.flutterwave.com/v3";

/**
 * Fournisseur Flutterwave — mobile money (MTN, Orange Money, etc.),
 * pertinent pour les corridors Côte d'Ivoire / Cameroun / Sénégal / Nigeria.
 *
 * SÉCURITÉ : toutes les requêtes passent par HTTPS avec la clé secrète en
 * header Authorization — jamais dans l'URL, jamais loggée.
 */
export class FlutterwaveProvider extends PaymentProvider {
  constructor() {
    super("flutterwave");
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: { Authorization: `Bearer ${env.flutterwave.secretKey}` },
      timeout: 15000,
    });
  }

  async initiatePayment({ amount, currency, idempotencyKey, metadata, customerPhone }) {
    const res = await this.client.post("/charges?type=mobile_money_franco", {
      tx_ref: idempotencyKey,
      amount,
      currency,
      phone_number: customerPhone,
      email: metadata?.email || "noreply@sendmoney.app",
      meta: metadata,
    });

    return {
      providerRef: res.data.data.id,
      status: "pending",
      redirectUrl: res.data.data.redirect_url, // confirmation OTP côté opérateur mobile
    };
  }

  verifyWebhookSignature(rawBody, signatureHeader) {
    // Flutterwave envoie un hash fixe à comparer en temps constant (anti timing-attack).
    const expected = env.flutterwave.webhookHash;
    if (!signatureHeader || !expected) return false;
    const a = Buffer.from(signatureHeader);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    try {
      return crypto.timingSafeEqual(a, b);
    } catch {
      return false;
    }
  }

  parseWebhookEvent(rawBody) {
    const event = JSON.parse(rawBody);
    const data = event.data;
    const statusMap = { successful: "succeeded", failed: "failed", pending: "pending" };
    return {
      providerRef: data.id,
      status: statusMap[data.status] || "unknown",
      amount: data.amount,
      currency: data.currency,
      eventType: event.event,
    };
  }

  async refund(providerRef, amount) {
    const res = await this.client.post(`/transactions/${providerRef}/refund`, { amount });
    return { status: res.data.status };
  }
}

export function logProviderError(provider, err) {
  logger.error(`Erreur fournisseur ${provider}`, {
    message: err.message,
    status: err.response?.status,
  });
}
