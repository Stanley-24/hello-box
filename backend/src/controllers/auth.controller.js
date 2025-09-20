import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
  try {

    let { fullname, email, password } = req.body;
    fullname = typeof fullname === "string" ? fullname.trim() : "";
    email = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!fullname || !email || password === undefined || password === null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (typeof password !== "string") {
      return res.status(400).json({ message: "Password must be a string" });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    // Persist user first
    await newUser.save();

    // Issue token after successful save
    generateToken(newUser._id, res);

    return res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      profilePic: newUser.profilePic,
      message: "User created successfully",
    });
  } catch (error) {
    // Handle duplicate key (race condition)
    if (error?.code === 11000 && error?.keyPattern?.email) {
      return res.status(409).json({ message: "User already exists" });
    }

    console.error("Error in signup controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  res.send({ message: "Login endpoint" });
};

export const logout = async (req, res) => {
  res.send({ message: "Logout endpoint" });
};
