import React, { useEffect, useState } from "react";
import * as api from "../../api/realApi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.adminListUsers().then(setUsers);
  }, []);

  const filtered = users.filter((u) =>
    `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header-row">
        <h1>Utilisateurs</h1>
        <button className="btn btn-primary">+ Ajouter un utilisateur</button>
      </div>

      <input
        type="search"
        placeholder="Rechercher un utilisateur..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="employees-search-input"
        style={{ marginBottom: 16, maxWidth: 320 }}
      />

      <div className="table-wrapper">
      <table>
        <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Statut</th><th /></tr></thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td><span className="badge">{u.status}</span></td>
              <td className="cell-actions"><button>✏️</button><button className="btn-danger-icon">🗑️</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
