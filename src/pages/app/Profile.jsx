import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="page">
      <h1>Mon profil</h1>
      <div className="card" style={{ maxWidth: 480 }}>
        <div className="recap-row"><span>Nom</span><b>{user?.name}</b></div>
        <div className="recap-row"><span>Email</span><b>{user?.email}</b></div>
        <div className="recap-row"><span>Rôle</span><b>{user?.role === "admin" ? "Administrateur" : "Utilisateur"}</b></div>
        <p className="muted" style={{ marginTop: 16 }}>
          La modification du profil (mot de passe, préférences, sécurité) sera
          branchée sur le vrai backend d'authentification.
        </p>
      </div>
    </div>
  );
}
