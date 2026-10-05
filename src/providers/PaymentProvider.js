/**
 * Contrat commun à tous les fournisseurs de paiement.
 * ----------------------------------------------------
 * Ajouter un nouveau fournisseur (Wise, Orange Money, MTN MoMo, PayPal...) ?
 * Implémente cette interface et enregistre-le dans services/paymentService.js
 * — rien d'autre dans l'app n'a besoin de changer.
 *
 * Toute classe concrète doit implémenter :
 *   - initiatePayment(payment): Promise<{ providerRef, status, redirectUrl? }>
 *   - verifyWebhookSignature(rawBody, signatureHeader): boolean
 *   - parseWebhookEvent(rawBody): { providerRef, status, amount, currency }
 *   - refund(providerRef, amount): Promise<{ status }>
 */
export class PaymentProvider {
  constructor(name) {
    if (new.target === PaymentProvider) {
      throw new Error("PaymentProvider est abstraite, ne pas l'instancier directement.");
    }
    this.name = name;
  }

  async initiatePayment(/* payment */) {
    throw new Error(`${this.name} : initiatePayment() non implémenté`);
  }

  verifyWebhookSignature(/* rawBody, signatureHeader */) {
    throw new Error(`${this.name} : verifyWebhookSignature() non implémenté`);
  }

  parseWebhookEvent(/* rawBody */) {
    throw new Error(`${this.name} : parseWebhookEvent() non implémenté`);
  }

  async refund(/* providerRef, amount */) {
    throw new Error(`${this.name} : refund() non implémenté`);
  }
}
