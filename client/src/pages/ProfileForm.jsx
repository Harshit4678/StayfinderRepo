import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProfileForm() {
  const { token, setUser, user } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    mobile: user?.mobile || "",
  });

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/complete-profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(res.data.user, token);
      navigate("/profile"); // Profile page pe le jao
    } catch (err) {
      alert(err.response?.data?.msg || "Profile save failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-center">
          Complete Your Profile
        </h2>

        <input
          type="text"
          placeholder="Full Name (as per ID)"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="date"
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="tel"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-2 rounded"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}
