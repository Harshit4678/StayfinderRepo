import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

export default function PaymentPage() {
  const { id } = useParams(); // listingId
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Get booking info from state
  const bookingInfo = location.state || {};

  const [form, setForm] = useState({
    checkIn: bookingInfo.checkIn || "",
    checkOut: bookingInfo.checkOut || "",
    guests: bookingInfo.guests || 1,
    cardNumber: "",
    cvv: "",
    expiry: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Calculate price using pricePerNight from state if available
  const calculatePrice = () => {
    const nights =
      (new Date(form.checkOut) - new Date(form.checkIn)) /
      (1000 * 60 * 60 * 24);
    const pricePerNight = bookingInfo.pricePerNight || 1000;
    return nights > 0 ? nights * pricePerNight : 0;
  };

  const handleBooking = async () => {
    setLoading(true);
    setErrorMsg("");
    if (!form.checkIn || !form.checkOut) {
      setErrorMsg("Please select check-in and check-out dates.");
      setLoading(false);
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/bookings",
        {
          listingId: id,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          guests: form.guests,
          totalPrice: calculatePrice(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Booking confirmed!");
      navigate(`/listings/${id}`); // Redirect to listing details page
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.reason ||
          err?.response?.data?.msg ||
          "Booking failed. Try again."
      );
    }
    setLoading(false);
  };

  return (
    <>
      <div className="max-w-xl mx-auto p-6 mt-6 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Payment (Mock)</h2>

        <div className="space-y-4">
          <input
            type="date"
            value={form.checkIn}
            onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
            className="w-full border p-2 rounded"
            placeholder="Check-in Date"
          />
          <input
            type="date"
            value={form.checkOut}
            onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
            className="w-full border p-2 rounded"
            placeholder="Check-out Date"
          />
          <input
            type="number"
            min="1"
            value={form.guests}
            onChange={(e) =>
              setForm({ ...form, guests: Number(e.target.value) })
            }
            className="w-full border p-2 rounded"
            placeholder="Guests"
          />

          {/* MOCK CARD INPUTS */}
          <input
            type="text"
            placeholder="Card Number"
            className="w-full border p-2 rounded"
            value={form.cardNumber}
            onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              className="w-1/2 border p-2 rounded"
              value={form.expiry}
              onChange={(e) => setForm({ ...form, expiry: e.target.value })}
            />
            <input
              type="text"
              placeholder="CVV"
              className="w-1/2 border p-2 rounded"
              value={form.cvv}
              onChange={(e) => setForm({ ...form, cvv: e.target.value })}
            />
          </div>

          {errorMsg && (
            <div className="text-red-600 font-semibold">{errorMsg}</div>
          )}

          <button
            onClick={handleBooking}
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded mt-4"
          >
            {loading ? "Processing..." : `Pay ₹${calculatePrice()} & Book`}
          </button>
        </div>
      </div>
    </>
  );
}
