import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        👨‍💼 Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/admin/hosts"
          className="bg-white p-6 shadow hover:shadow-lg rounded-xl border hover:border-blue-500 transition"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Hosts</h2>
          <p className="text-gray-500 text-sm">
            View & manage all registered hosts.
          </p>
        </Link>

        <Link
          to="/admin/view-listings"
          className="bg-white p-6 shadow hover:shadow-lg rounded-xl border hover:border-blue-500 transition"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Listings</h2>
          <p className="text-gray-500 text-sm">
            Moderate listings, activate/deactivate properties.
          </p>
        </Link>

        <Link
          to="/admin/reports"
          className="bg-white p-6 shadow hover:shadow-lg rounded-xl border hover:border-blue-500 transition"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Reports</h2>
          <p className="text-gray-500 text-sm">
            View reported users or listings from customers.
          </p>
        </Link>
      </div>
    </div>
  );
}
