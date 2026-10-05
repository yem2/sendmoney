import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import PublicLayout from "./components/layout/PublicLayout";
import AppLayout from "./components/layout/AppLayout";
import AdminLayout from "./components/layout/AdminLayout";

import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/app/Dashboard";
import SendMoney from "./pages/app/SendMoney";
import Beneficiaries from "./pages/app/Beneficiaries";
import Transactions from "./pages/app/Transactions";
import Profile from "./pages/app/Profile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCountries from "./pages/admin/AdminCountries";
import AdminRates from "./pages/admin/AdminRates";
import AdminTransactions from "./pages/admin/AdminTransactions";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Site public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
          </Route>

          {/* Espace utilisateur (protégé) */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="tableau-de-bord" element={<Dashboard />} />
            <Route path="envoyer" element={<SendMoney />} />
            <Route path="beneficiaires" element={<Beneficiaries />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="profil" element={<Profile />} />
          </Route>

          {/* Console admin (protégée, rôle admin) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="utilisateurs" element={<AdminUsers />} />
            <Route path="pays-devises" element={<AdminCountries />} />
            <Route path="taux-de-change" element={<AdminRates />} />
            <Route path="transactions" element={<AdminTransactions />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
