import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { GoogleLogin } from "@react-oauth/google";

export default function AuthPage() {
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();
  const { setMobile: saveMobile, setUser } = useAuthStore();

  const handleContinue = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { mobile });
      saveMobile(mobile); // Zustand me save, taaki next page me use ho
      navigate("/verify"); // OTP page pe le jao
    } catch (err) {
      alert(err.response?.data?.msg || "OTP sending failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Login / Register
        </h2>
        <label className="text-sm text-gray-600">Enter Mobile Number</label>
        <div className="flex mt-1">
          <span className="bg-gray-100 px-3 py-2 rounded-l border border-r-0 text-sm text-gray-600">
            +91
          </span>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full border py-2 px-3 rounded-r"
            placeholder="9876543210"
          />
        </div>
        <button
          onClick={handleContinue}
          className="mt-4 bg-black text-white w-full py-2 rounded"
        >
          Continue
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Or continue with</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const res = await axios.post(
                      "http://localhost:5000/api/auth/google-login",
                      {
                        token: credentialResponse.credential,
                      }
                    );

                    const { user, token } = res.data;
                    setUser(user, token);
                    // You may want to save user/token in your auth store here
                    // setUser(user, token); // Uncomment and implement setUser if needed

                    if (user.isProfileComplete) {
                      navigate("/profile");
                    } else {
                      navigate("/complete-profile");
                    }
                  } catch {
                    alert("Google Login Failed");
                  }
                }}
                onError={() => {
                  alert("Google Login Failed");
                }}
              />
            </div>
            <button
              onClick={() => navigate("/email-auth")}
              className="border py-2 rounded text-sm col-span-2"
            >
              Continue with Email
            </button>

            <button className="border py-2 rounded text-sm col-span-2">
              Continue with Facebook
            </button>
            <button className="border py-2 rounded text-sm col-span-2">
              Continue with Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
