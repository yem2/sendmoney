import React, { useState } from "react";

const INITIAL_RATES = [
  { pair: "XOF → XAF", rate: 0.6574 },
  { pair: "EUR → USD", rate: 1.0704 },
  { pair: "NGN → XOF", rate: 0.5925 },
];

export default function AdminRates() {
  const [rates, setRates] = useState(INITIAL_RATES);

  function updateRate(i, value) {
    setRates((prev) => prev.map((r, idx) => (idx === i ? { ...r, rate: Number(value) } : r)));
  }

  return (
    <div className="page">
      <h1>Taux de change</h1>
      <p className="muted">
        Taux appliqués aux transferts. En production, brancher un fournisseur de
        taux en temps réel (ex. API bancaire) plutôt qu'une saisie manuelle.
      </p>

      <table>
        <thead><tr><th>Paire de devises</th><th>Taux</th><th /></tr></thead>
        <tbody>
          {rates.map((r, i) => (
            <tr key={r.pair}>
              <td>{r.pair}</td>
              <td><input type="number" step="0.0001" value={r.rate} onChange={(e) => updateRate(i, e.target.value)} style={{ width: 100 }} /></td>
              <td><button className="btn btn-secondary">Enregistrer</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
