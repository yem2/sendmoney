import * as paymentService from "../services/paymentService.js";
import { logger } from "../utils/logger.js";

/**
 * RÈGLE DE SÉCURITÉ NON NÉGOCIABLE :
 * Un webhook sans signature vérifiée = n'importe qui sur Internet peut
 * prétendre "ce paiement de 10M XOF a réussi". Chaque fournisseur DOIT
 * vérifier sa signature avant que l'événement soit traité.
 *
 * Ces routes utilisent express.raw() (voir routes/webhookRoutes.js) : le
 * corps brut non parsé est nécessaire pour calculer la signature — ne
 * JAMAIS mettre express.json() avant une route de webhook.
 */

export async function stripeWebhook(req, res) {
  const provider = paymentService.getProvider("stripe");
  const signature = req.headers["stripe-signature"];

  if (!provider.verifyWebhookSignature(req.body, signature)) {
    logger.warn("Webhook Stripe rejeté : signature invalide");
    return res.status(400).json({ error: "Signature invalide." });
  }

  try {
    const event = provider.parseWebhookEvent(req.body, signature);
    await paymentService.handleProviderEvent("stripe", event);
    res.status(200).json({ received: true });
  } catch (err) {
    logger.error("Erreur traitement webhook Stripe", { message: err.message });
    res.status(200).json({ received: true }); // 200 pour éviter les re-tentatives en boucle du fournisseur
  }
}

export async function flutterwaveWebhook(req, res) {
  const provider = paymentService.getProvider("flutterwave");
  const signature = req.headers["verif-hash"];

  if (!provider.verifyWebhookSignature(req.body.toString(), signature)) {
    logger.warn("Webhook Flutterwave rejeté : signature invalide");
    return res.status(400).json({ error: "Signature invalide." });
  }

  try {
    const event = provider.parseWebhookEvent(req.body.toString());
    await paymentService.handleProviderEvent("flutterwave", event);
    res.status(200).json({ received: true });
  } catch (err) {
    logger.error("Erreur traitement webhook Flutterwave", { message: err.message });
    res.status(200).json({ received: true });
  }
}
