import React from "react";
import { COUNTRIES } from "../../api/mockApi";

export default function AdminCountries() {
  return (
    <div className="page">
      <div className="page-header-row">
        <h1>Pays & devises</h1>
        <button className="btn btn-primary">+ Ajouter un pays</button>
      </div>

      <table>
        <thead><tr><th>Pays</th><th>Devise</th><th>Statut</th><th /></tr></thead>
        <tbody>
          {COUNTRIES.map((c) => (
            <tr key={c.code}>
              <td>{c.flag} {c.name}</td>
              <td>{c.currency}</td>
              <td><span className="badge">Actif</span></td>
              <td className="cell-actions"><button>✏️</button><button className="btn-danger-icon">🗑️</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
