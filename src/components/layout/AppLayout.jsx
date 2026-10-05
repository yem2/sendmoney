import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/app/tableau-de-bord", label: "Tableau de bord", icon: "📊" },
  { to: "/app/envoyer", label: "Envoyer de l'argent", icon: "💸" },
  { to: "/app/beneficiaires", label: "Mes bénéficiaires", icon: "👥" },
  { to: "/app/transactions", label: "Mes transactions", icon: "📄" },
  { to: "/app/profil", label: "Mon profil", icon: "⚙️" },
];

export default function AppLayout() {
  const { user, logout } = useAuth();

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
        {user?.role === "admin" && (
          <NavLink to="/admin" className="app-sidebar-admin-link">🛠️ Console admin</NavLink>
        )}
        <button className="app-sidebar-logout" onClick={logout}>Déconnexion</button>
      </aside>
      <main className="app-content"><Outlet /></main>
    </div>
  );
}
