import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Protège une route pour les utilisateurs connectés (adminOnly: réservée admin). */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div className="page-loading">Chargement…</div>;
  if (!user) return <Navigate to="/connexion" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/app/tableau-de-bord" replace />;

  return children;
}
