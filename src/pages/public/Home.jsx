import React from "react";
import { Link } from "react-router-dom";
import { COUNTRIES, POPULAR_COUNTRIES } from "../../api/mockApi";

export default function Home() {
  return (
    <div className="page">
      <section className="hero">
        <h1>Une plateforme de transfert véritablement internationale</h1>
        <p>Envoyez de l'argent partout dans le monde. Simplement. Rapidement. En toute sécurité.</p>
        <Link to="/inscription" className="btn btn-white">Commencer →</Link>
      </section>

      <section className="features">
        <div className="feature"><b>⚡ Rapide</b><p>Votre argent arrive en quelques minutes</p></div>
        <div className="feature"><b>🔒 Sécurisé</b><p>Technologie de pointe et cryptage SSL</p></div>
        <div className="feature"><b>📱 Accessible</b><p>Sur mobile et ordinateur, dans le monde entier</p></div>
      </section>

      <section className="country-list">
        <h2>{COUNTRIES.length} pays disponibles, à l'envoi comme à la réception</h2>
        <div className="country-chips">
          {POPULAR_COUNTRIES.map((c) => (
            <span key={c.code} className="chip">{c.flag} {c.name}</span>
          ))}
          <Link to="/inscription" className="chip chip-link">+ {COUNTRIES.length - POPULAR_COUNTRIES.length} autres →</Link>
        </div>
      </section>
    </div>
  );
}
