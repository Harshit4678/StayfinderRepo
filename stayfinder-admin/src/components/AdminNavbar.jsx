import { Link, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/dashboard" className="text-xl font-bold text-white">
        StayFinder Admin
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/admin/hosts" className="hover:underline text-sm font-medium">
          Hosts
        </Link>
        <Link
          to="/admin/view-listings"
          className="hover:underline text-sm font-medium"
        >
          Listings
        </Link>
        <Link
          to="/admin/reports"
          className="hover:underline text-sm font-medium"
        >
          Reports
        </Link>
        <button
          onClick={handleLogout}
          className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
