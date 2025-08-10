import { useEffect, useState } from "react";
import axios from "axios";
import ListingCard from "../components/ListingCard";
import AssistantWidget from "../Chat/AiAssistant/AssistantWidget";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    guests: "",
  });

  const fetchListings = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(
        `http://localhost:5000/api/listings?${query}`
      );
      // Only show active listings
      const activeListings = res.data.filter((listing) => listing.isActive);
      setListings(activeListings);
    } catch (err) {
      console.log("Fetch listings failed:", err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSearch = () => {
    fetchListings();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Search Unique Stays 🏡</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Location"
          className="border p-2 rounded"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <input
          type="number"
          placeholder="Min Price"
          className="border p-2 rounded"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Price"
          className="border p-2 rounded"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />
        <input
          type="number"
          placeholder="Guests"
          className="border p-2 rounded"
          value={filters.guests}
          onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
        />
      </div>

      <button
        onClick={handleSearch}
        className="mb-6 px-4 py-2 bg-black text-white rounded"
      >
        Search
      </button>

      {/* Listings */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>
      <AssistantWidget />
    </div>
  );
}
