import React from "react";

export default function HostSidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-56 min-h-full bg-gray-100 border-r p-4">
      <nav className="flex flex-col gap-2">
        <button
          className={`text-left px-3 py-2 rounded ${
            activeTab === "listings"
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-50"
          }`}
          onClick={() => setActiveTab("listings")}
        >
          Your Listings
        </button>
        <button
          className={`text-left px-3 py-2 rounded ${
            activeTab === "bookings"
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-50"
          }`}
          onClick={() => setActiveTab("bookings")}
        >
          Bookings by Customers
        </button>
        <button
          className={`text-left px-3 py-2 rounded ${
            activeTab === "inbox"
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-50"
          }`}
          onClick={() => setActiveTab("inbox")}
        >
          Inbox
        </button>
      </nav>
    </aside>
  );
}
