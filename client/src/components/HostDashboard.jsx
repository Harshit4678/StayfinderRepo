import { useState } from "react";
import HostSidebar from "./HostSidebar";
import HostListingsTab from "./HostListingsTab";
import HostBookingsTab from "./HostBookingsTab";
import { useAuthStore } from "../store/authStore";
import Inbox from "../pages/Inbox"; // <-- Add this import

export default function HostDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("listings");

  if (user?.role !== "host")
    return (
      <div className="text-center mt-10">Only hosts can access this page.</div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <HostSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Host Dashboard
        </h1>
        {activeTab === "listings" && <HostListingsTab />}
        {activeTab === "bookings" && <HostBookingsTab />}
        {activeTab === "inbox" && <Inbox />} {/* <-- Add this line */}
      </main>
    </div>
  );
}
