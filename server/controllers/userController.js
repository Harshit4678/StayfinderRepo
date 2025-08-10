import User from "../models/User.js";

// Become a host
export const becomeHost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.role === "host") {
      return res.status(400).json({ msg: "You are already a host" });
    }

    user.role = "host";
    await user.save();

    res.json({ msg: "You are now a host", user });
  } catch (err) {
    res.status(500).json({ msg: "Failed to become host" });
  }
};
