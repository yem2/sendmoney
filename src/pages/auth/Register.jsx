import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(form);
      navigate("/app/tableau-de-bord");
    } catch (err) {
      setError(err.message || "Échec de l'inscription.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Créer un compte</h1>
        {error && <div className="form-error">{error}</div>}
        <label>Nom complet<input value={form.name} onChange={(e) => update("name", e.target.value)} required /></label>
        <label>Email<input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required /></label>
        <label>Mot de passe<input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required /></label>
        <button className="btn btn-primary" disabled={submitting}>{submitting ? "Création…" : "S'inscrire"}</button>
        <div className="auth-switch">Déjà un compte ? <Link to="/connexion">Se connecter</Link></div>
      </form>
    </div>
  );
}
