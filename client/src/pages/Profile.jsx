import UserProfile from "./UserProfile";
import BecomeHostButton from "../components/BecomeHostButton";
import { useAuthStore } from "../store/authStore";

export default function Profile() {
  const { user } = useAuthStore();

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="p-6 max-w-4xl mx-auto">
          <UserProfile />
          {user?.role === "user" && (
            <div className="mt-6">
              <BecomeHostButton />
            </div>
          )}
          {user?.role === "host" && (
            <div className="mt-6">
              <a
                href="/host/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Go to Host Dashboard
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
