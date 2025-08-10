import { useAuthStore } from "../store/authStore";

export default function UserProfile() {
  const { user } = useAuthStore();

  if (!user)
    return <div className="text-center mt-10">User not logged in.</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <div className="space-y-3">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Mobile:</strong> {user.mobile}
        </p>
        <p>
          <strong>DOB:</strong> {user.dob}
        </p>
        <p>
          <strong>Role:</strong>{" "}
          {user.role === "host" ? "Host" : user.isAdmin ? "Admin" : "User"}
        </p>
      </div>
    </div>
  );
}
