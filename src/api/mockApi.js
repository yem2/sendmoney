/**
 * Couche API — implémentation MOCK en mémoire.
 * ----------------------------------------------
 * Chaque fonction ici correspond à un futur appel réseau réel.
 * Remplace le corps de chaque fonction par un `fetch(...)` vers ton
 * backend (Node/Express, Supabase, etc.) sans changer leur signature :
 * le reste de l'app n'a rien à changer.
 */

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const COUNTRIES = [
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮", currency: "XOF" },
  { code: "FR", name: "France", flag: "🇫🇷", currency: "EUR" },
  { code: "US", name: "États-Unis", flag: "🇺🇸", currency: "USD" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", currency: "NGN" },
  { code: "GA", name: "Gabon", flag: "🇬🇦", currency: "XAF" },
  { code: "CM", name: "Cameroun", flag: "🇨🇲", currency: "XAF" },
  { code: "SN", name: "Sénégal", flag: "🇸🇳", currency: "XOF" },
  { code: "CD", name: "RDC", flag: "🇨🇩", currency: "CDF" },
];

let beneficiaries = [
  { id: "b1", name: "Jean Dupont", country: "CM", phone: "+237 6 12 34 56 78", mode: "Mobile Money" },
  { id: "b2", name: "Marie Diallo", country: "SN", phone: "+221 77 12 34 56", mode: "Orange Money" },
];

let transactions = [
  { id: "t1", from: "CI", to: "CM", sentAmount: 100000, sentCurrency: "XOF", receivedAmount: 64740, receivedCurrency: "XAF", date: "2025-12-18", status: "Réussi" },
  { id: "t2", from: "FR", to: "US", sentAmount: 500, sentCurrency: "EUR", receivedAmount: 535.2, receivedCurrency: "USD", date: "2025-10-10", status: "Réussi" },
];

let currentUser = null;

// ---- Auth ----
export async function login(email, password) {
  await delay();
  if (!email || !password) throw new Error("Email et mot de passe requis.");
  currentUser = { id: "u1", name: "Jean Dupont", email, role: email.includes("admin") ? "admin" : "user" };
  return currentUser;
}

export async function register(payload) {
  await delay();
  currentUser = { id: "u_new", name: payload.name, email: payload.email, role: "user" };
  return currentUser;
}

export async function getCurrentUser() {
  await delay(100);
  return currentUser;
}

export function logout() {
  currentUser = null;
}

// ---- Transfer ----
export async function getExchangeRate(fromCurrency, toCurrency) {
  await delay(200);
  // Taux factices pour le prototype — brancher un vrai fournisseur de taux.
  const fakeRates = { "XOF-XAF": 0.6574, "EUR-USD": 1.0704, "NGN-XOF": 0.5925 };
  return fakeRates[`${fromCurrency}-${toCurrency}`] || 1;
}

export async function createTransfer(payload) {
  await delay(500);
  const tx = { id: `t${transactions.length + 1}`, date: new Date().toISOString().slice(0, 10), status: "Réussi", ...payload };
  transactions = [tx, ...transactions];
  return tx;
}

// ---- Beneficiaries ----
export async function listBeneficiaries() {
  await delay();
  return beneficiaries;
}

export async function addBeneficiary(payload) {
  await delay();
  const b = { id: `b${beneficiaries.length + 1}`, ...payload };
  beneficiaries = [b, ...beneficiaries];
  return b;
}

export async function deleteBeneficiary(id) {
  await delay();
  beneficiaries = beneficiaries.filter((b) => b.id !== id);
}

// ---- Transactions ----
export async function listTransactions() {
  await delay();
  return transactions;
}

// ---- Dashboard stats ----
export async function getDashboardStats() {
  await delay();
  return {
    balance: 0,
    sentCount: transactions.length,
    receivedCount: 2,
    beneficiariesCount: beneficiaries.length,
  };
}

// ---- Admin ----
export async function adminListUsers() {
  await delay();
  return [
    { id: "u1", name: "Jean Dupont", email: "jean@exemple.com", role: "Utilisateur", status: "Actif" },
    { id: "u2", name: "Marie Diallo", email: "marie@exemple.com", role: "Utilisateur", status: "Actif" },
    { id: "u3", name: "Admin", email: "admin@sendmoney.com", role: "Administrateur", status: "Actif" },
  ];
}
