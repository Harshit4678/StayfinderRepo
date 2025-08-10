import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

export default function HostBookingsTab() {
  const { token, user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "host") return;
    setLoading(true);
    axios
      .get("http://localhost:5000/api/bookings/host", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [user, token]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bookings by Customers</h2>
      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-600">No one has booked your listings yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border rounded shadow overflow-hidden"
            >
              <img
                src={booking.listing.images[0]}
                className="w-full h-40 object-cover"
                alt=""
              />
              <div className="p-3 space-y-1">
                <h3 className="font-semibold text-lg">
                  {booking.listing.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Booked by: {booking.user.name} ({booking.user.email})
                </p>
                <p className="text-sm text-gray-600">
                  {booking.checkIn.slice(0, 10)} to{" "}
                  {booking.checkOut.slice(0, 10)}
                </p>
                <p className="font-bold text-sm">Guests: {booking.guests}</p>
                <p className="font-bold text-sm">₹{booking.totalPrice}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
