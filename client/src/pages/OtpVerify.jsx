import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const { mobile, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          mobile,
          code: otp,
        }
      );

      const { token, user } = res.data;
      setUser(user, token);

      if (!user.isProfileComplete) {
        navigate("/complete-profile");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Enter OTP</h2>
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border px-4 py-2 rounded text-center text-lg tracking-wider"
          placeholder="6-digit OTP"
        />
        <button
          onClick={handleVerify}
          className="mt-4 bg-black text-white w-full py-2 rounded"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
