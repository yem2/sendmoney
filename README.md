# SendMoney — Service de paiement

Backend Node/Express qui orchestre les paiements derrière une interface
commune à plusieurs fournisseurs (Stripe, Flutterwave), pensé pour être
robuste et sécurisé par défaut.

## ⚠️ Avant de lancer de vrais paiements — prérequis non techniques

Une plateforme de transfert d'argent international est une activité
**réglementée**. Avant tout transfert réel d'argent, il te faut (selon les
pays visés) :
- Une licence de money transmitter / agrément auprès du régulateur financier
  local, ou un partenariat avec un acteur déjà agréé.
- Un programme KYC (vérification d'identité des utilisateurs) et AML
  (lutte anti-blanchiment) — souvent une obligation légale, pas une option.
- Les vrais comptes marchands Stripe et Flutterwave, créés et validés par
  toi (identité de l'entreprise, documents justificatifs).

Rien de tout cela ne peut être automatisé depuis ce service — c'est une
démarche administrative/légale de ton côté.

## Ce que ce service fait

- **Abstraction fournisseur** (`src/providers/`) : Stripe pour carte/international,
  Flutterwave pour mobile money. Ajouter un fournisseur = implémenter
  `PaymentProvider.js`, sans toucher au reste.
- **Idempotence** : chaque paiement est associé à une clé unique — impossible
  de débiter deux fois un utilisateur à cause d'un retry réseau.
- **Vérification de signature obligatoire sur chaque webhook** — sans elle,
  n'importe qui pourrait simuler un paiement réussi.
- **Aucune donnée de carte ne transite par ce backend** (tokenisation Stripe.js
  côté navigateur) — réduit fortement le périmètre de conformité PCI-DSS.
- **Rate limiting**, **Helmet** (en-têtes de sécurité), **CORS restreint**,
  **limite de taille de requête**, **logs qui redacted les champs sensibles**,
  **gestion d'erreurs qui ne fuite jamais de détails internes**.
- **Garde-fous métier** : plafond de montant, validation stricte des entrées.

## Démarrage

```bash
npm install
cp .env.example .env   # puis remplis tes vraies clés de test Stripe/Flutterwave
npm run dev
```

Teste les webhooks en local avec la Stripe CLI :
```bash
stripe listen --forward-to localhost:4000/api/webhooks/stripe
```

## Ce qui reste à faire pour la production

1. **Authentification réelle** dans `src/middleware/requireAuth.js` (JWT ou
   session signée) — actuellement un placeholder de démo.
2. **Vraie base de données** dans `src/db/paymentRepository.js` (schéma SQL
   fourni en commentaire) — actuellement en mémoire, perdu au redémarrage.
3. **Stockage des clés en secret manager** (AWS Secrets Manager, Vercel
   Environment Variables chiffrées...) plutôt qu'un simple `.env` en prod.
4. **Tests automatisés** des cas d'échec (carte refusée, timeout fournisseur,
   webhook rejoué) avant tout trafic réel.
5. **Monitoring/alerting** sur les échecs de paiement et les pics de
   webhooks rejetés (signe possible de tentative de fraude).
6. Brancher ce service au frontend `sendmoney-app` : la page `SendMoney.jsx`
   doit appeler `POST /api/payments` à l'étape de confirmation, puis utiliser
   `clientSecret` (Stripe.js) ou `redirectUrl` (Flutterwave) pour finaliser.

## Pourquoi deux fournisseurs et pas un seul "universel" ?

Les plateformes comme Wise ou PayPal ne couvrent pas bien le mobile money
ouest-africain ; les agrégateurs locaux (Flutterwave, CinetPay) ne couvrent
pas bien les cartes internationales. Le pattern adaptateur ici permet
d'ajouter ou retirer un fournisseur par pays/corridor sans réécrire la
logique métier.
