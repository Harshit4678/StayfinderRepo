import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";

export default function EditListing() {
  const { token } = useAuthStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    pricePerNight: "",
    images: [""],
    maxGuests: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/listings/${id}`)
      .then((res) => {
        const l = res.data;
        setForm({
          title: l.title,
          description: l.description,
          location: l.location,
          pricePerNight: l.pricePerNight,
          images: l.images,
          maxGuests: l.maxGuests,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleChange = (e, index = null) => {
    if (index !== null) {
      const newImages = [...form.images];
      newImages[index] = e.target.value;
      setForm({ ...form, images: newImages });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleEditListing = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/listings/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Listing updated!");
      navigate("/host/dashboard");
    } catch {
      alert("Failed to update listing");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Listing</h2>
      <form onSubmit={handleEditListing} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="pricePerNight"
          placeholder="Price per Night"
          value={form.pricePerNight}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="maxGuests"
          placeholder="Max Guests"
          value={form.maxGuests}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        {form.images.map((img, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Image URL ${index + 1}`}
            value={img}
            onChange={(e) => handleChange(e, index)}
            className="w-full border px-3 py-2 rounded"
          />
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
