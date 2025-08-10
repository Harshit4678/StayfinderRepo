import jwt from "jsonwebtoken";
// authMiddleware.js
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // Set both id and _id for compatibility
    req.userId = decoded.id || decoded._id;
    req.user = {
      ...decoded,
      id: decoded.id || decoded._id,
      _id: decoded._id || decoded.id,
    };

    next();
  } catch {
    return res.status(403).json({ msg: "Invalid token" });
  }
};
