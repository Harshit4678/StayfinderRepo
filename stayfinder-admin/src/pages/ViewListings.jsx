import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewListings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/listings");
        setListings(res.data);
      } catch (err) {
        console.error("Failed to fetch listings", err);
      }
    };

    fetchListings();
  }, []);

  const handleToggleListing = async (listingId) => {
    try {
      const token = localStorage.getItem("admin-token");
      const res = await axios.patch(
        `http://localhost:5000/api/admin/listings/${listingId}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data.msg);
      setListings((prev) =>
        prev.map((l) =>
          l._id === listingId ? { ...l, isActive: res.data.isActive } : l
        )
      );
    } catch {
      alert("Failed to toggle listing status");
    }
  };

  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">All Listings</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Title</th>
              <th className="p-2">Location</th>
              <th className="p-2">Price</th>
              <th className="p-2">Host</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing._id} className="border-t">
                <td className="p-2">{listing.title}</td>
                <td className="p-2">{listing.location}</td>
                <td className="p-2">₹{listing.pricePerNight}</td>
                <td className="p-2">{listing.host?.name || "Unknown"}</td>
                <td className="p-2">
                  {listing.isActive ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Inactive</span>
                  )}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleToggleListing(listing._id)}
                    className={`text-sm px-3 py-1 rounded ${
                      listing.isActive ? "bg-red-500" : "bg-green-500"
                    } text-white`}
                  >
                    {listing.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
