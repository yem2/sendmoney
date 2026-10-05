import React, { useEffect, useState } from "react";
import * as api from "../../api/mockApi";
import { COUNTRIES } from "../../api/mockApi";

export default function Beneficiaries() {
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", country: COUNTRIES[0].code, phone: "", mode: "Mobile Money" });

  function load() {
    api.listBeneficiaries().then(setList);
  }
  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    await api.addBeneficiary(form);
    setForm({ name: "", country: COUNTRIES[0].code, phone: "", mode: "Mobile Money" });
    setShowForm(false);
    load();
  }

  async function handleDelete(id) {
    if (!window.confirm("Supprimer ce bénéficiaire ?")) return;
    await api.deleteBeneficiary(id);
    load();
  }

  return (
    <div className="page">
      <div className="page-header-row">
        <h1>Mes bénéficiaires</h1>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>+ Ajouter un bénéficiaire</button>
      </div>

      {showForm && (
        <form className="card" onSubmit={handleAdd} style={{ marginBottom: 20 }}>
          <div className="form-grid">
            <label>Nom<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Pays
              <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
              </select>
            </label>
            <label>Téléphone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
            <label>Mode de réception
              <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
                <option>Mobile Money</option><option>Compte bancaire</option><option>Cash Pickup</option>
              </select>
            </label>
          </div>
          <div className="wizard-actions"><span /><button className="btn btn-primary">Enregistrer</button></div>
        </form>
      )}

      <table>
        <thead><tr><th>Nom</th><th>Pays</th><th>Téléphone</th><th>Mode</th><th /></tr></thead>
        <tbody>
          {list.map((b) => {
            const country = COUNTRIES.find((c) => c.code === b.country);
            return (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td>{country?.flag} {country?.name}</td>
                <td>{b.phone}</td>
                <td>{b.mode}</td>
                <td><button className="btn-danger-icon" onClick={() => handleDelete(b.id)}>🗑️</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
