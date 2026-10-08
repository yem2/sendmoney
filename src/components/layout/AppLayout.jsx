import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/app/tableau-de-bord", label: "Tableau de bord", icon: "📊" },
  { to: "/app/envoyer", label: "Envoyer", icon: "💸" },
  { to: "/app/beneficiaires", label: "Bénéficiaires", icon: "👥" },
  { to: "/app/transactions", label: "Transactions", icon: "📄" },
  { to: "/app/profil", label: "Profil", icon: "⚙️" },
];

export default function AppLayout() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="logo">🌐 SendMoney</div>
        <nav>
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
              <span>{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>
        {isAdmin && (
          <NavLink to="/admin" className="app-sidebar-admin-link">🛠️ Console admin</NavLink>
        )}
        <button className="app-sidebar-logout" onClick={logout}>Déconnexion</button>
      </aside>

      <main className="app-content"><Outlet /></main>

      {/* Barre d'onglets mobile — remplace la sidebar sous 720px */}
      <nav className="app-bottom-nav">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
