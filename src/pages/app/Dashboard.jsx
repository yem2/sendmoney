import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../../api/realApi";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.getDashboardStats().then(setStats);
    api.listTransactions().then((tx) => setTransactions(tx.slice(0, 5)));
  }, []);

  return (
    <div className="page">
      <h1>Bonjour {user?.name}, voici un aperçu de votre activité</h1>

      {stats && (
        <div className="stat-grid">
          <div className="stat"><b>{stats.balance} XOF</b><span>Solde disponible</span></div>
          <div className="stat"><b>{stats.sentCount}</b><span>Transferts envoyés</span></div>
          <div className="stat"><b>{stats.receivedCount}</b><span>Transferts reçus</span></div>
          <div className="stat"><b>{stats.beneficiariesCount}</b><span>Bénéficiaires</span></div>
        </div>
      )}

      <div className="dashboard-cta">
        <div>
          <h3>Envoyez de l'argent vers plus de 50 pays en toute sécurité</h3>
        </div>
        <Link to="/app/envoyer" className="btn btn-primary">Faire un transfert →</Link>
      </div>

      <h3>Dernières transactions</h3>
      <div className="table-wrapper">
      <table>
        <thead><tr><th>Trajet</th><th>Envoyé</th><th>Reçu</th><th>Statut</th></tr></thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.from} → {t.to}</td>
              <td>{t.sentAmount.toLocaleString("fr-FR")} {t.sentCurrency}</td>
              <td>{t.receivedAmount.toLocaleString("fr-FR")} {t.receivedCurrency}</td>
              <td><span className="badge">{t.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <Link to="/app/transactions" className="link-button">Voir tout →</Link>
    </div>
  );
}
