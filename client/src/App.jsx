import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";

// Pages
import AuthPage from "./pages/AuthPage";
import OtpVerify from "./pages/OtpVerify";
import ProfileForm from "./pages/ProfileForm";
import AdminLogin from "./pages/AdminLogin";
import EmailAuth from "./pages/EmailAuth";
import PaymentPage from "./pages/PaymentPage";
import AssistantWidget from "./Chat/AiAssistant/AssistantWidget";

import Home from "./pages/Home";
import AddListing from "./pages/AddListing";
import ListingDetails from "./pages/ListingDetails";
import EditListing from "./pages/EditListing";
import HostDashboard from "./components/HostDashboard";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Inbox from "./pages/Inbox";

function App() {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const storedUser = localStorage.getItem("stayfinder-user");
    const storedToken = localStorage.getItem("stayfinder-token");
    if (storedUser && storedToken && !user) {
      setUser(JSON.parse(storedUser), storedToken);
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Auth Pages */}
        <Route path="/authpage" element={<AuthPage />} />
        <Route path="/verify" element={<OtpVerify />} />
        <Route path="/complete-profile" element={<ProfileForm />} />
        <Route path="/email-auth" element={<EmailAuth />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Home />} />
        <Route path="/listings/:id" element={<ListingDetails />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/authpage" />}
        />
        <Route path="/my-bookings" element={<MyBookings />} />

        <Route path="/payment/:id" element={<PaymentPage />} />
        <Route
          path="/add-listing"
          element={
            user?.role === "host" ? (
              <AddListing />
            ) : user ? (
              <Navigate to="/" />
            ) : (
              <Navigate to="/authpage" />
            )
          }
        />
        <Route path="/edit-listing/:id" element={<EditListing />} />
        <Route
          path="/host/dashboard"
          element={
            user?.role === "host" ? <HostDashboard /> : <Navigate to="/" />
          }
        />
        <Route path="/inbox" element={<Inbox />} />
        {/* Fallback for 404 */}
        <Route
          path="*"
          element={
            <div className="text-center mt-10">404 | Page not found</div>
          }
        />
      </Routes>
      <AssistantWidget />
    </BrowserRouter>
  );
}

export default App;
