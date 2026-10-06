import React, { useEffect, useState } from "react";
import * as api from "../../api/realApi";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.listTransactions().then(setTransactions);
  }, []);

  return (
    <div className="page">
      <h1>Transactions (toutes plateformes)</h1>
      <div className="table-wrapper">
      <table>
        <thead><tr><th>Date</th><th>Trajet</th><th>Envoyé</th><th>Reçu</th><th>Statut</th></tr></thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{new Date(t.date).toLocaleDateString("fr-FR")}</td>
              <td>{t.from} → {t.to}</td>
              <td>{t.sentAmount.toLocaleString("fr-FR")} {t.sentCurrency}</td>
              <td>{t.receivedAmount.toLocaleString("fr-FR")} {t.receivedCurrency}</td>
              <td><span className="badge">{t.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
