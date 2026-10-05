import React, { useEffect, useState } from "react";
import * as api from "../../api/mockApi";
import { COUNTRIES } from "../../api/mockApi";

function countryLabel(code) {
  const c = COUNTRIES.find((c) => c.code === code);
  return c ? `${c.flag} ${c.name}` : code;
}

export default function Transactions() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.listTransactions().then(setList);
  }, []);

  const filtered = list.filter((t) =>
    `${t.from} ${t.to} ${t.status}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <h1>Historique des transactions</h1>

      <input
        type="search"
        placeholder="Rechercher par pays ou statut..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="employees-search-input"
        style={{ marginBottom: 16, maxWidth: 320 }}
      />

      <table>
        <thead>
          <tr><th>Date</th><th>Envoi → Réception</th><th>Montant envoyé</th><th>Montant reçu</th><th>Statut</th></tr>
        </thead>
        <tbody>
          {filtered.map((t) => (
            <tr key={t.id}>
              <td>{new Date(t.date).toLocaleDateString("fr-FR")}</td>
              <td>{countryLabel(t.from)} → {countryLabel(t.to)}</td>
              <td>{t.sentAmount.toLocaleString("fr-FR")} {t.sentCurrency}</td>
              <td>{t.receivedAmount.toLocaleString("fr-FR")} {t.receivedCurrency}</td>
              <td><span className="badge">{t.status}</span></td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={5} className="muted" style={{ textAlign: "center", padding: 24 }}>Aucune transaction trouvée.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
