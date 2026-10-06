# SendMoney — Application

Projet React (Vite + React Router) structuré pour devenir une vraie
application de transfert d'argent international.

## Démarrage

```bash
npm install
npm run dev
```

## Déploiement sur Vercel

Ce projet est une SPA (Single Page Application) : toutes les routes
(`/app/tableau-de-bord`, `/admin/utilisateurs`, etc.) sont gérées côté
client par React Router, pas par de vrais fichiers sur le serveur. Sans
configuration particulière, Vercel renvoie une 404 dès qu'on navigue
directement vers une de ces routes (lien partagé, rafraîchissement de
page) — c'est le fichier `vercel.json` à la racine qui corrige ça en
redirigeant toutes les routes vers `index.html`.

Paramètres de build à vérifier dans Vercel (normalement auto-détectés) :
- **Framework preset** : Vite
- **Build command** : `npm run build`
- **Output directory** : `dist`

Si le problème persiste après avoir ajouté `vercel.json`, vérifie que
le fichier est bien à la racine du projet déployé (pas dans `src/`), et
redéploie (un simple nouveau build ne suffit pas toujours — un redeploy
complet peut être nécessaire pour que Vercel relise `vercel.json`).

Puis ouvre http://localhost:5173

Compte démo : n'importe quel email/mot de passe sur `/connexion`.
Utilise un email contenant **"admin"** (ex. `admin@test.com`) pour accéder
à la console admin via `/admin`.

## Structure

```
src/
  api/mockApi.js          # Couche API — à remplacer par de vrais appels backend
  context/AuthContext.jsx # Authentification globale (contexte React)
  components/
    ProtectedRoute.jsx    # Garde de routes (connecté / admin)
    layout/
      PublicLayout.jsx    # Navbar + footer du site public
      AppLayout.jsx       # Sidebar espace utilisateur
      AdminLayout.jsx     # Sidebar console admin
  pages/
    public/Home.jsx
    auth/Login.jsx, Register.jsx
    app/Dashboard.jsx, SendMoney.jsx, Beneficiaries.jsx, Transactions.jsx, Profile.jsx
    admin/AdminDashboard.jsx, AdminUsers.jsx, AdminCountries.jsx, AdminRates.jsx, AdminTransactions.jsx
  styles/global.css
  App.jsx                 # Toutes les routes de l'application
  main.jsx                # Point d'entrée
```

## Routes principales

| Route | Accès |
|---|---|
| `/` | Public |
| `/connexion`, `/inscription` | Public |
| `/app/tableau-de-bord` | Connecté |
| `/app/envoyer` | Connecté — assistant de transfert en 4 étapes |
| `/app/beneficiaires` | Connecté |
| `/app/transactions` | Connecté |
| `/app/profil` | Connecté |
| `/admin` | Admin uniquement |
| `/admin/utilisateurs`, `/admin/pays-devises`, `/admin/taux-de-change`, `/admin/transactions` | Admin uniquement |

## Brancher un vrai backend

Tout passe par `src/api/mockApi.js` : chaque fonction (`login`, `createTransfer`,
`listBeneficiaries`, etc.) garde la même signature mais doit faire un vrai
appel réseau (`fetch`) vers ton API. Aucun composant n'a besoin de changer
tant que la signature des fonctions reste identique.

Priorités suggérées pour un vrai lancement :
1. Authentification réelle (JWT ou session) + hash des mots de passe.
2. Vrai fournisseur de taux de change (API bancaire/Wise/Xe...).
3. Stockage persistant (PostgreSQL/MongoDB) pour utilisateurs, bénéficiaires,
   transactions.
4. Conformité réglementaire (KYC, AML) avant tout transfert réel d'argent —
   obligatoire légalement pour ce type de plateforme.
5. Paiement/règlement réel avec un partenaire agréé (Wise, Stripe Treasury,
   partenaire local de mobile money, etc.).

## Pages pas encore construites

- Mot de passe oublié (page dédiée)
- Tarifs, FAQ, À propos, Contact (contenu statique, faciles à ajouter)
- Vue mobile dédiée (le responsive CSS couvre une bonne partie, mais pas
  d'app mobile native)
- Rapports et support côté admin

## Prochaine étape : GitHub & déploiement

Ce projet ne peut pas être poussé automatiquement sur ton GitHub depuis
cette conversation (aucun connecteur GitHub disponible ici). Pour continuer :

1. Initialise un repo : `git init && git add . && git commit -m "feat: scaffold SendMoney"`.
2. Pousse-le sur GitHub, puis relie-le à un nouveau projet Vercel (ou à
   `smarthr-roster` si tu veux le remplacer — à confirmer, ce sont deux
   projets différents).
3. Ou utilise **Claude Code** en local, qui a un accès réel en lecture/écriture
   à ton repo, pour poursuivre le développement et pousser directement.
