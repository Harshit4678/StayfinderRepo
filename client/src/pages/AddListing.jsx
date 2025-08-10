import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function AddListing() {
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    pricePerNight: "",
    images: [""],
    maxGuests: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e, index = null) => {
    if (index !== null) {
      const newImages = [...form.images];
      newImages[index] = e.target.value;
      setForm({ ...form, images: newImages });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleAddListing = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://localhost:5000/api/listings", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Listing created successfully!");
      navigate("/host/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.msg ||
          error.response?.data?.error ||
          "Failed to create listing"
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add a New Listing</h2>
      {error && (
        <div className="mb-4 text-red-600 bg-red-100 px-3 py-2 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleAddListing} className="space-y-4">
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
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="maxGuests"
          placeholder="Max Guests"
          value={form.maxGuests || ""}
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
          Add Listing
        </button>
      </form>
    </div>
  );
}
