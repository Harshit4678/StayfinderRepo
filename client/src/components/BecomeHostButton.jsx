import axios from "axios";
import { useAuthStore } from "../store/authStore";

export default function BecomeHostButton() {
  const { token, setUser } = useAuthStore();

  const handleClick = async () => {
    try {
      const res = await axios.patch(
        "http://localhost:5000/api/users/become-host",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(res.data.user, token);
      alert("You're now a host! 🎉");
    } catch {
      alert("Failed to become a host");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-black text-white px-4 py-2 rounded"
    >
      Become a Host
    </button>
  );
}
