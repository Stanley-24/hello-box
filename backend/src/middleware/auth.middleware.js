import User from "../models/User.js"
import { ENV } from "../lib/env.js"
import jwt from "jsonwebtoken"

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Not authorized: no token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, ENV.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Not authorized: invalid or expired token" });
    }

    const userId = decoded.id || decoded.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authorized: user not found" });
    }

    
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
