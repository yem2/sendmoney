import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <header className="public-nav">
        <Link to="/" className="logo">🌐 SendMoney</Link>
        <nav>
          <Link to="/">Accueil</Link>
          <Link to="/tarifs">Tarifs</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="public-nav-actions">
          <Link to="/connexion" className="btn btn-secondary">Se connecter</Link>
          <Link to="/inscription" className="btn btn-primary">S'inscrire</Link>
        </div>
      </header>

      <main><Outlet /></main>

      <footer className="public-footer">
        <span>SendMoney — Plus qu'un transfert, une connexion entre les peuples.</span>
      </footer>
    </div>
  );
}
