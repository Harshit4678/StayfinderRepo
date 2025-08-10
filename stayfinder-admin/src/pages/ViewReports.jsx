import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem("admin-token");
      const res = await axios.get("http://localhost:5000/api/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
    };

    fetchReports();
  }, []);

  const updateStatus = async (reportId, status) => {
    const token = localStorage.getItem("admin-token");
    await axios.patch(
      `http://localhost:5000/api/reports/${reportId}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setReports((prev) =>
      prev.map((r) => (r._id === reportId ? { ...r, status } : r))
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Reports</h2>
      {reports.map((r) => (
        <div key={r._id} className="border p-4 mb-4 rounded">
          <p>
            <strong>By:</strong> {r.reportedBy?.name} ({r.reportedBy?.email})
          </p>
          <p>
            <strong>Message:</strong> {r.message}
          </p>
          <p>
            <strong>Status:</strong> {r.status}
          </p>
          <button
            onClick={() => updateStatus(r._id, "In Review")}
            className="mr-2 bg-yellow-500 text-white px-2 py-1"
          >
            In Review
          </button>
          <button
            onClick={() => updateStatus(r._id, "Resolved")}
            className="bg-green-500 text-white px-2 py-1"
          >
            Mark Resolved
          </button>
        </div>
      ))}
    </div>
  );
}
