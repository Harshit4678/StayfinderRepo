import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function EmailAuth() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async () => {
    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/email-login"
        : "http://localhost:5000/api/auth/email-register";

      const res = await axios.post(url, form);
      const { user, token } = res.data;

      setUser(user, token);

      if (!user.isProfileComplete) {
        navigate("/complete-profile");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded-xl">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {isLogin ? "Login with Email" : "Register with Email"}
      </h2>

      <input
        type="email"
        placeholder="Email Address"
        className="w-full border px-4 py-2 rounded mb-3"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border px-4 py-2 rounded mb-3"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white py-2 rounded mb-3"
      >
        {isLogin ? "Login" : "Register"}
      </button>

      <p
        className="text-sm text-center cursor-pointer text-blue-600"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "New here? Register" : "Already have an account? Login"}
      </p>
    </div>
  );
}
