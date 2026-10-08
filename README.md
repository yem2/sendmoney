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

## Déployer sur Vercel

Ce dossier est déjà prêt pour Vercel : `api/index.js` expose l'app Express
comme fonction serverless, et `vercel.json` redirige toutes les routes vers
cette fonction. Je ne peux pas déclencher ce déploiement moi-même depuis
cette conversation (aucun outil de création/déploiement Vercel disponible
ici, en lecture seule) — à faire de ton côté, deux façons possibles :

**Option A — via le site Vercel (le plus simple)**
1. Pousse ce dossier dans un repo GitHub (nouveau repo, séparé de
   `sendmoney-app`).
2. Sur vercel.com → "Add New Project" → importe ce repo.
3. Dans les paramètres du projet, onglet **Environment Variables**, ajoute
   exactement les 5 variables du fichier `.env` (`DATABASE_URL`,
   `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN`, `PORT` — `PORT` est inutile
   sur Vercel mais sans danger à laisser). Mets `CORS_ORIGIN` à l'URL réelle
   de ton frontend (`https://sendmoney-one.vercel.app`), pas `localhost`.
4. Déploie. Vercel te donne une URL du style `https://sendmoney-api-xxxx.vercel.app`.

**Option B — via la CLI Vercel (plus rapide si tu as déjà `vercel` installé)**
```bash
npm i -g vercel   # si pas déjà fait
cd sendmoney-api
vercel            # suit les invites, crée le projet
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add JWT_EXPIRES_IN production
vercel env add CORS_ORIGIN production   # mets l'URL de sendmoney-one.vercel.app
vercel --prod
```

## Brancher le frontend `sendmoney-app`

Le fichier `src/api/realApi.js` du projet `sendmoney-app` (déjà en place)
lit `VITE_API_BASE_URL`. Une fois l'API déployée :
1. Récupère l'URL Vercel de cette API (ex. `https://sendmoney-api-xxxx.vercel.app/api`).
2. Dans le projet Vercel de `sendmoney-app`, ajoute la variable d'environnement
   `VITE_API_BASE_URL` avec cette valeur.
3. Redéploie `sendmoney-app` (un redeploy complet, pour que Vite relise la variable).

## Prochaines étapes avant la production

1. **Changer de mot de passe** pour le compte super admin dès la première
   connexion (route à construire : `PATCH /api/auth/password`).
2. Rebrancher le service de paiement (`sendmoney-payments`, livré
   séparément) pour qu'il écrive directement dans cette même base `sendmoney`
   au lieu de son stockage en mémoire — remplacer son `paymentRepository.js`
   par des requêtes vers `transactions` ici.
3. Vercel met en veille les fonctions inactives (cold start) — le premier
   appel après une pause peut prendre 1-2 secondes de plus, normal.
