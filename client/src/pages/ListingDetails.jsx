import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import ChatIcon from "../Chat/ChatIcon";
import ChatModal from "../Chat/ChatModal";

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

  // Booking states
  const [listing, setListing] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookedDates, setBookedDates] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [reportMsg, setReportMsg] = useState("");

  // Review states
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);

  // Chat states
  const [showChat, setShowChat] = useState(false);

  // Fetch listing details, reviews, and booked dates
  const fetchBookedDates = () => {
    axios.get(`http://localhost:5000/api/bookings/booked/${id}`).then((res) => {
      const dates = res.data.map((d) => new Date(d).toDateString());
      setBookedDates(dates);
    });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/listings/${id}`)
      .then((res) => setListing(res.data));
    axios.get(`http://localhost:5000/api/reviews/${id}`).then((res) => {
      setReviews(res.data);
      // Check if current user has reviewed
      if (user && res.data.some((r) => r.user._id === user._id))
        setHasReviewed(true);
      else setHasReviewed(false);
    });
    fetchBookedDates();
    // eslint-disable-next-line
  }, [id, user]);

  // Calculate price
  useEffect(() => {
    if (listing && checkIn && checkOut) {
      const days =
        (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
      setTotalPrice(days > 0 ? days * listing.pricePerNight : 0);
    }
  }, [checkIn, checkOut, listing]);

  // Check if selected dates overlap with booked dates
  const isDateRangeBooked = () => {
    if (!checkIn || !checkOut) return false;
    let curr = new Date(checkIn);
    const end = new Date(checkOut);
    while (curr <= end) {
      if (bookedDates.includes(curr.toDateString())) return true;
      curr.setDate(curr.getDate() + 1);
    }
    return false;
  };

  // Payment page navigation handler
  const handleGoToPayment = () => {
    setErrorMsg("");
    if (!user) return setErrorMsg("Please login to book.");
    if (!checkIn || !checkOut) return setErrorMsg("Please select dates.");
    if (isDateRangeBooked())
      return setErrorMsg(
        "Selected dates are not available. Please choose different dates."
      );
    navigate(`/payment/${id}`, {
      state: {
        checkIn,
        checkOut,
        guests,
        pricePerNight: listing.pricePerNight,
      },
    });
  };

  // Review submit handler
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:5000/api/reviews/${id}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews([...reviews, res.data]);
      setHasReviewed(true);
      setRating(0);
      setComment("");
    } catch (err) {
      alert(err?.response?.data?.msg || "Error posting review");
    }
  };

  // Report an Issue handler
  const handleReport = async () => {
    if (!user) return setReportMsg("Please login to report an issue.");
    const message = prompt(
      "Describe the issue you want to report (e.g. 'This host is asking for extra money off-platform...')"
    );
    if (!message) return;
    try {
      await axios.post(
        "http://localhost:5000/api/reports",
        {
          listingId: listing._id,
          hostId: listing.host._id,
          message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReportMsg(
        "✅ Your issue has been reported to StayFinder support. Thank you!"
      );
    } catch {
      setReportMsg("❌ Failed to submit your report. Please try again later.");
    }
  };

  if (!listing) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 grid md:grid-cols-2 gap-10">
      {/* Listing Info & Reviews */}
      <div>
        <img
          src={listing.images[0]}
          className="w-full h-80 object-cover rounded-lg"
          alt={listing.title}
        />
        <h1 className="text-3xl font-bold mt-4">{listing.title}</h1>
        <p className="text-gray-600 mt-2">{listing.location}</p>
        <p className="mt-4">{listing.description}</p>
        <p className="mt-4 font-semibold">₹{listing.pricePerNight} / night</p>

        <hr className="my-6" />

        <h2 className="text-2xl font-bold mb-3">Reviews ⭐</h2>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map((r) => (
          <div key={r._id} className="mb-3 border-b pb-2">
            <p className="font-semibold">{r.user.name}</p>
            <p className="text-yellow-500">{"★".repeat(r.rating)}</p>
            <p>{r.comment}</p>
          </div>
        ))}

        {user && !hasReviewed && (
          <form onSubmit={handleSubmitReview} className="mt-6 space-y-3">
            <h4 className="font-semibold">Leave a Review</h4>
            <div>
              <label className="block text-sm font-medium">Rating (1–5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border p-2 rounded"
                rows={3}
                required
              ></textarea>
            </div>
            <button className="bg-black text-white px-4 py-2 rounded">
              Submit Review
            </button>
          </form>
        )}
      </div>

      {/* Booking Box */}
      <div className="p-6 border rounded-lg shadow space-y-4 bg-white">
        <h2 className="text-xl font-bold">Book This Stay</h2>

        <div className="space-y-2">
          <label>Check-In Date</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="border p-2 w-full rounded"
            min={new Date().toISOString().split("T")[0]}
          />

          <label>Check-Out Date</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="border p-2 w-full rounded"
            min={checkIn || new Date().toISOString().split("T")[0]}
          />

          <label>Guests</label>
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            min="1"
            className="border p-2 w-full rounded"
          />
        </div>

        {totalPrice > 0 && (
          <p className="text-lg font-semibold">
            Total: ₹{totalPrice} for your stay
          </p>
        )}

        {errorMsg && (
          <div className="text-red-600 font-semibold">{errorMsg}</div>
        )}

        <button
          onClick={handleGoToPayment}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
          disabled={isDateRangeBooked() || !user}
        >
          Book Now
        </button>

        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Already Booked Dates:</h3>
          {bookedDates.length > 0 ? (
            <ul className="text-sm list-disc list-inside text-red-600 max-h-32 overflow-y-auto">
              {bookedDates.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-green-700">No bookings yet.</p>
          )}
        </div>
      </div>

      {/* Subtle Report Link */}
      <div className="text-right mt-2">
        <button
          onClick={handleReport}
          className="text-xs text-gray-500 underline hover:text-red-600 transition"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          Having an issue? Report here
        </button>
        {reportMsg && (
          <div className="text-xs mt-1 font-semibold text-red-600 text-right">
            {reportMsg}
          </div>
        )}
      </div>

      {/* Chat Button and Modal */}
      {user && listing.host._id !== user._id && (
        <>
          <ChatIcon onClick={() => setShowChat(true)} />
          {showChat && (
            <ChatModal
              hostId={listing.host._id}
              user={user}
              onClose={() => setShowChat(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
