import Report from "../models/Report.js";

export const createReport = async (req, res) => {
  try {
    const { listingId, hostId, message } = req.body;

    const report = new Report({
      reportedBy: req.userId,
      listing: listingId || null,
      host: hostId || null,
      message,
    });

    await report.save();

    res.status(201).json({ msg: "Report submitted", report });
  } catch (err) {
    res.status(500).json({ msg: "Failed to submit report" });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reportedBy", "name email")
      .populate("listing", "title")
      .populate("host", "name email");
    res.json(reports);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch reports" });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ msg: "Report not found" });

    report.status = status;
    await report.save();

    res.json({ msg: "Report status updated", report });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update report status" });
  }
};
