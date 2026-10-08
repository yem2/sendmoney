import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const NAV = [
  { to: "/admin", label: "Tableau de bord", icon: "📊", end: true },
  { to: "/admin/utilisateurs", label: "Utilisateurs", icon: "👤" },
  { to: "/admin/pays-devises", label: "Pays & devises", icon: "🌍" },
  { to: "/admin/taux-de-change", label: "Taux de change", icon: "💱" },
  { to: "/admin/transactions", label: "Transactions", icon: "📄" },
];

export default function AdminLayout() {
  return (
    <div className="app-shell admin-shell">
      <aside className="app-sidebar admin-sidebar">
        <div className="logo">🛠️ Console admin</div>
        <nav>
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? "active" : "")}>
              <span>{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>
        <NavLink to="/app/tableau-de-bord" className="app-sidebar-admin-link">← Retour à l'espace utilisateur</NavLink>
      </aside>
      <main className="app-content"><Outlet /></main>
    </div>
  );
}
