import { Link } from "react-router-dom";

export default function ListingCard({ listing }) {
  return (
    <Link
      to={`/listings/${listing._id}`} // <-- FIXED: was /listing/
      className="block shadow rounded overflow-hidden"
    >
      <img src={listing.images[0]} className="w-full h-48 object-cover" />
      <div className="p-3">
        <h3 className="text-lg font-semibold">{listing.title}</h3>
        <p className="text-sm text-gray-500">{listing.location}</p>
        <p className="text-sm font-bold">₹{listing.pricePerNight} / night</p>
      </div>
    </Link>
  );
}
