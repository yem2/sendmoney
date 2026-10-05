import * as paymentService from "../services/paymentService.js";

export async function createPayment(req, res, next) {
  try {
    const { amount, currency, receptionMode, customerPhone, idempotencyKey } = req.body;

    const payment = await paymentService.initiatePayment({
      userId: req.user.id, // dérivé du token vérifié par requireAuth, jamais du body
      amount,
      currency,
      receptionMode,
      customerPhone,
      idempotencyKey,
      metadata: { source: "sendmoney-app" },
    });

    // On ne renvoie jamais l'objet complet (peut contenir des refs internes) :
    // seulement ce dont le frontend a besoin pour finaliser le paiement.
    res.status(201).json({
      paymentId: payment.id,
      status: payment.status,
      clientSecret: payment.clientSecret, // Stripe seulement
      redirectUrl: payment.redirectUrl, // Flutterwave seulement
    });
  } catch (err) {
    next(err);
  }
}
