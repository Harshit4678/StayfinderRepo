import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";

export default function HostListingsTab() {
  const { user, token } = useAuthStore();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // <-- Add error state

  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    setError(""); // reset error
    axios
      .get(`http://localhost:5000/api/listings/host/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setListings(res.data))
      .catch((err) => {
        setListings([]);
        setError(
          err.response?.data?.msg ||
            "Failed to fetch listings. Please try again later."
        );
      })
      .finally(() => setLoading(false));
  }, [user, token]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Listings</h2>
        <Link
          to="/add-listing"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Listing
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600 font-semibold">{error}</p>
      ) : listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded shadow overflow-hidden bg-white flex flex-col"
            >
              <img
                src={listing.images?.[0] || "/no-image.png"}
                alt={listing.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
                <p className="text-gray-500 text-sm mb-1">{listing.location}</p>
                <p className="font-bold text-sm mb-1">
                  ₹{listing.pricePerNight} per night
                </p>
                <p className="text-xs text-gray-600 mb-2">
                  Max Guests:{" "}
                  {listing.maxGuests || listing.guestCapacity || "N/A"}
                </p>
                <div className="mt-auto flex gap-2">
                  <Link
                    to={`/listings/${listing._id}`}
                    className="px-3 py-1 bg-gray-200 rounded text-xs"
                  >
                    View
                  </Link>
                  <Link
                    to={`/edit-listing/${listing._id}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
