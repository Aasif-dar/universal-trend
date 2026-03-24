import User from "../models/User.js";

const adminOnly = async (req, res, next) => {
  const user = await User.findById(req.user);
  if (user?.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin only" });
  }
};

export default adminOnly;
