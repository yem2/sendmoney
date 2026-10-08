import React, { useEffect, useState } from "react";
import * as api from "../../api/realApi";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.adminListUsers().then(setUsers);
    api.listTransactions().then(setTransactions);
  }, []);

  return (
    <div className="page">
      <h1>Console administrateur</h1>
      <p className="muted">Gérez la plateforme, les utilisateurs et les paramètres.</p>

      <div className="stat-grid">
        <div className="stat"><b>{users.length}</b><span>Utilisateurs</span></div>
        <div className="stat"><b>{transactions.length}</b><span>Transactions</span></div>
        <div className="stat"><b>8</b><span>Pays actifs</span></div>
        <div className="stat"><b>6</b><span>Devises gérées</span></div>
      </div>
    </div>
  );
}
