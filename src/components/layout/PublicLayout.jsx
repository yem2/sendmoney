import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Ferme le menu mobile automatiquement à chaque changement de page.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <div className="public-layout">
      <header className="public-nav">
        <Link to="/" className="logo">🌐 SendMoney</Link>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <Link to="/">Accueil</Link>
          <Link to="/tarifs">Tarifs</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
          <div className="public-nav-actions-mobile">
            <Link to="/connexion" className="btn btn-secondary">Se connecter</Link>
            <Link to="/inscription" className="btn btn-primary">S'inscrire</Link>
          </div>
        </nav>

        <div className="public-nav-actions">
          <Link to="/connexion" className="btn btn-secondary">Se connecter</Link>
          <Link to="/inscription" className="btn btn-primary">S'inscrire</Link>
        </div>

        <button
          className="nav-burger"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
      </header>

      <main><Outlet /></main>

      <footer className="public-footer">
        <span>SendMoney — Plus qu'un transfert, une connexion entre les peuples.</span>
      </footer>
    </div>
  );
}
