# SendMoney — Prototype

Prototype HTML/CSS/JS autonome (un seul fichier `index.html`, aucune dépendance)
couvrant trois écrans :

- **Accueil** — page d'atterrissage
- **Envoyer de l'argent** — assistant en 4 étapes (pays d'envoi, pays de réception,
  bénéficiaire, récapitulatif avec calcul des frais et taux de change)
- **Tableau de bord** — statistiques et dernières transactions

## Lancer le prototype

Ouvre simplement `index.html` dans un navigateur, aucun serveur requis.

## Écrans non encore prototypés (vus sur la maquette d'origine)

- Authentification (inscription / connexion / mot de passe oublié)
- Mes bénéficiaires (liste, ajout, édition)
- Historique des transactions (liste complète, filtres, détail)
- Vue mobile dédiée
- Console administrateur (utilisateurs, pays & devises, frais, taux de change,
  transactions, rapports, support, paramètres)

## Pour en faire un vrai projet

Ce fichier unique est pensé comme point de départ visuel/interactif. Pour un
vrai projet de production, il faudra le réécrire en React (ou autre framework)
avec :
- un vrai routeur (React Router) à la place du switch de vues en JS pur,
- une couche API pour les pays, taux de change, bénéficiaires, transactions,
- une authentification réelle,
- une séparation claire des rôles utilisateur / administrateur.
