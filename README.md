# SendMoney — API backend (Neon)

Backend Express branché sur une vraie base **Neon Postgres**, déjà créée et
peuplée (projet Neon `smarthr-int3d`, base `sendmoney`, 190 pays, schéma
`users`/`beneficiaries`/`transactions`/`countries`).

## ⚠️ Le fichier `.env` contient de vrais identifiants

`.env` inclut déjà ta vraie chaîne de connexion Neon et un secret JWT généré
aléatoirement — prêt à l'emploi, mais **ne le commite jamais sur GitHub**
(`.gitignore` l'exclut déjà). Si tu l'as déjà exposé accidentellement,
change le mot de passe du rôle `sendmoney_owner` dans la console Neon.

## Démarrage

```bash
npm install
npm run dev
```

L'API tourne sur `http://localhost:4001`.

## Compte super administrateur

Le compte `Joresyemte12@gmail.com` existe déjà dans la base avec le rôle
`super_admin` et un mot de passe temporaire. **Connecte-toi puis considère
ce mot de passe comme à usage unique** (aucune route de changement de mot
de passe n'est encore construite — à ajouter avant la prod).

## Endpoints

| Méthode | Route | Accès |
|---|---|---|
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/register` | Public |
| GET | `/api/auth/me` | Connecté |
| GET | `/api/countries` | Public |
| PATCH | `/api/countries/:code/active` | Admin |
| GET/POST | `/api/beneficiaries` | Connecté |
| DELETE | `/api/beneficiaries/:id` | Connecté (le sien uniquement) |
| GET | `/api/exchange-rate?from=XOF&to=XAF` | Connecté |
| GET/POST | `/api/transactions` | Connecté |
| GET | `/api/dashboard/stats` | Connecté |
| GET | `/api/admin/users` | Admin |
| PATCH | `/api/admin/users/:id/status` | Admin |
| PATCH | `/api/admin/users/:id/role` | **Super admin uniquement** |

## Sécurité déjà en place

- Mots de passe hashés en bcrypt (12 rounds), jamais stockés en clair.
- JWT signé, vérifié sur chaque route protégée — le `role` dans le token
  vient de la base, jamais du corps de la requête.
- Changer le rôle d'un utilisateur (promouvoir admin) est réservé au
  `super_admin` — un admin normal ne peut pas se promouvoir lui-même.
- `user_id` toujours dérivé du token vérifié, jamais du corps de la requête
  — empêche un utilisateur d'agir au nom d'un autre.
- Rate limiting sur `/auth/login` (anti brute-force).
- Toutes les requêtes SQL sont paramétrées (`$1, $2...`) — aucune
  concaténation de chaîne, donc pas d'injection SQL possible par ce chemin.

## Brancher le frontend `sendmoney-app`

Remplace `src/api/mockApi.js` du projet `sendmoney-app` par des appels
`fetch` vers `http://localhost:4001/api/...` (mêmes noms de fonctions
`login`, `register`, `listBeneficiaries`, etc. — voir le fichier
`src/api/realApi.js` fourni séparément, à copier par-dessus `mockApi.js`).

## Prochaines étapes avant la production

1. **Déployer l'API** (Render, Railway, Fly.io, ou une fonction serverless
   Vercel) — elle doit tourner en continu, contrairement au frontend statique.
2. **Changer de mot de passe** pour le compte super admin dès la première
   connexion (route à construire : `PATCH /api/auth/password`).
3. **Déployer sur Vercel le `CORS_ORIGIN`** réel une fois le frontend en ligne
   (actuellement limité à `localhost:5173`).
4. Rebrancher le service de paiement (`sendmoney-payments`, livré
   séparément) pour qu'il écrive directement dans cette même base `sendmoney`
   au lieu de son stockage en mémoire — remplacer son `paymentRepository.js`
   par des requêtes vers `transactions` ici.
