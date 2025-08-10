import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

export default function MyBookings() {
  const { token } = useAuthStore();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/bookings/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBookings(res.data))
      .catch((err) => console.log("Booking fetch failed:", err));
  }, []);

  return (
    <>
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>

        {bookings.length === 0 ? (
          <p className="text-gray-500">You haven't booked any listings yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="border rounded overflow-hidden shadow"
              >
                <img
                  src={booking.listing.images[0]}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-lg">
                    {booking.listing.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {booking.checkIn.slice(0, 10)} →{" "}
                    {booking.checkOut.slice(0, 10)}
                  </p>
                  <p className="font-semibold text-sm mt-1">
                    ₹{booking.totalPrice} total
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
