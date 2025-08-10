// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewHosts from "./pages/ViewHosts";
import ViewListings from "./pages/ViewListings";
import AdminNavbar from "./components/AdminNavbar";
import ViewReports from "./pages/ViewReports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminNavbar />
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hosts"
          element={
            <ProtectedRoute>
              <AdminNavbar />
              <ViewHosts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/view-listings"
          element={
            <ProtectedRoute>
              <AdminNavbar />
              <ViewListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <AdminNavbar />
              <ViewReports />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
