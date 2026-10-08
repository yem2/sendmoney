import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/app/tableau-de-bord");
    } catch (err) {
      setError(err.message || "Échec de la connexion.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Se connecter</h1>
        {error && <div className="form-error">{error}</div>}
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Mot de passe<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        <p className="auth-hint">Astuce démo : un email contenant "admin" vous connecte en administrateur.</p>
        <button className="btn btn-primary" disabled={submitting}>{submitting ? "Connexion…" : "Se connecter"}</button>
        <Link to="/mot-de-passe-oublie" className="auth-link">Mot de passe oublié ?</Link>
        <div className="auth-switch">Pas encore de compte ? <Link to="/inscription">S'inscrire</Link></div>
      </form>
    </div>
  );
}
