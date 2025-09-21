import User from "../models/User.js"
import { ENV } from "../lib/env.js"
import jwt from "jsonwebtoken"



export const protectRoute = async (req, res, next ) => {
  try {
    const token = req.cookies.jwt
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    const userId = decoded.id || decoded.userId;
    const user = await User.findById(userId).select("-password");

    req.user = user
    next()
    
  } catch (error) {
    console.log("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}