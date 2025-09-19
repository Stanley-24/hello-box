
import User from "../models/User.js";

import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";


export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // hash password

    const salt = await bcrypt.genSalt(10);   // ✅ correct
    const hashedPassword = await bcrypt.hash(password, salt); // ✅ correct

    // create new user
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword
    });

    if (newUser) {
      generateToken(newUser._id, res)
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilePic: newUser.profilePic,
        message: "User created successfully"
      })


      // todo : send a welcome email

    }
    else {
      res.status(400).json({ message: "Invalid User data" });
    }
  } catch (error) {
    console.log("error in signing up in controller:", error);
    res.status(500).json({ message: "internal Server error" });
  }
}















export const login = async  (req, res) => {
  res.send({ message: "Login endpoint" });
}

export const logout = async (req, res) => {
  res.send({ message: "Logout endpoint" });
}