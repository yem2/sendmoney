/**
 * Couche API réelle — à copier dans sendmoney-app/src/api/realApi.js
 * (en remplacement complet du fichier mock) une fois le backend
 * sendmoney-api lancé. Mêmes noms de fonctions que le mock : aucun
 * composant React n'a besoin de changer.
 */
const API_BASE = import.meta.env?.VITE_API_BASE_URL || "http://localhost:4001/api";

export { COUNTRIES, POPULAR_COUNTRIES } from "./countries.js";

function authHeaders() {
  const token = localStorage.getItem("sendmoney_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Erreur ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// ---- Auth ----
export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await handle(res);
  localStorage.setItem("sendmoney_token", data.token);
  return data.user;
}

export async function register(payload) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await handle(res);
  localStorage.setItem("sendmoney_token", data.token);
  return data.user;
}

export async function getCurrentUser() {
  const token = localStorage.getItem("sendmoney_token");
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() });
    const data = await handle(res);
    return data.user;
  } catch {
    localStorage.removeItem("sendmoney_token");
    return null;
  }
}

export function logout() {
  localStorage.removeItem("sendmoney_token");
}

// ---- Transfert ----
export async function getExchangeRate(fromCurrency, toCurrency) {
  const res = await fetch(`${API_BASE}/exchange-rate?from=${fromCurrency}&to=${toCurrency}`, { headers: authHeaders() });
  const data = await handle(res);
  return data.rate;
}

export async function createTransfer(payload) {
  const res = await fetch(`${API_BASE}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({
      beneficiaryId: payload.beneficiaryId,
      fromCountry: payload.from,
      toCountry: payload.to,
      sentAmount: payload.sentAmount,
      sentCurrency: payload.sentCurrency,
      receivedCurrency: payload.receivedCurrency,
      idempotencyKey: payload.idempotencyKey || crypto.randomUUID(),
    }),
  });
  return handle(res);
}

// ---- Bénéficiaires ----
export async function listBeneficiaries() {
  const res = await fetch(`${API_BASE}/beneficiaries`, { headers: authHeaders() });
  return handle(res);
}

export async function addBeneficiary(payload) {
  const res = await fetch(`${API_BASE}/beneficiaries`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function deleteBeneficiary(id) {
  const res = await fetch(`${API_BASE}/beneficiaries/${id}`, { method: "DELETE", headers: authHeaders() });
  return handle(res);
}

// ---- Transactions ----
export async function listTransactions() {
  const res = await fetch(`${API_BASE}/transactions`, { headers: authHeaders() });
  return handle(res);
}

// ---- Dashboard ----
export async function getDashboardStats() {
  const res = await fetch(`${API_BASE}/dashboard/stats`, { headers: authHeaders() });
  return handle(res);
}

// ---- Admin ----
export async function adminListUsers() {
  const res = await fetch(`${API_BASE}/admin/users`, { headers: authHeaders() });
  return handle(res);
}

export async function adminSetUserRole(id, role) {
  const res = await fetch(`${API_BASE}/admin/users/${id}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ role }),
  });
  return handle(res);
}

export async function adminSetUserStatus(id, status) {
  const res = await fetch(`${API_BASE}/admin/users/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status }),
  });
  return handle(res);
}
