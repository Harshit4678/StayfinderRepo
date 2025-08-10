import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewHosts() {
  const [hosts, setHosts] = useState([]);
  const token = localStorage.getItem("admin-token");

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/hosts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHosts(res.data);
      } catch (err) {
        console.error("Failed to fetch hosts:", err);
      }
    };

    fetchHosts();
  }, [token]);

  const blockUnblock = async (hostId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/hosts/${hostId}/block-toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // update UI
      setHosts((prev) =>
        prev.map((host) =>
          host._id === hostId ? { ...host, isBlocked: !host.isBlocked } : host
        )
      );
    } catch {
      alert("Error updating host status");
    }
  };

  const sendEmail = async (email) => {
    const subject = prompt("Enter subject:");
    const message = prompt("Enter message:");

    if (!subject || !message) return;

    try {
      await axios.post(
        "http://localhost:5000/api/admin/email-host",
        { to: email, subject, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Email sent successfully!");
    } catch {
      alert("Failed to send email");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">🧑‍💼 Registered Hosts</h2>

      <div className="bg-white p-4 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Mobile</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hosts.map((host) => (
              <tr key={host._id} className="border-t">
                <td className="p-2">{host.name}</td>
                <td className="p-2">{host.email}</td>
                <td className="p-2">{host.mobile}</td>
                <td className="p-2">
                  <span
                    className={
                      host.isBlocked ? "text-red-600" : "text-green-600"
                    }
                  >
                    {host.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => blockUnblock(host._id)}
                    className="text-sm text-yellow-600 underline"
                  >
                    {host.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() => sendEmail(host.email)}
                    className="text-sm text-blue-600 underline ml-4"
                  >
                    Email Host
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
