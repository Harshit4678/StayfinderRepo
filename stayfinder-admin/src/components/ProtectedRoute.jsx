// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAdminStore } from "../store/adminAuthStore";

export default function ProtectedRoute({ children }) {
  const { admin } = useAdminStore();
  return admin ? children : <Navigate to="/" />;
}
