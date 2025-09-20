import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import { ENV } from "../lib/env.js";

// Sign Up Endpoint
export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // check if email is valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // before CR:
      // generateToken(newUser._id, res);
      // await newUser.save();

      // after CR:
      // Persist user first, then issue auth cookie
      const savedUser = await newUser.save();
      generateToken(savedUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullname,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });

      // Send welcome email after response is sent
      try {
        await sendWelcomeEmail(savedUser.email, savedUser.fullname, ENV.CLIENT_URL);
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }


    } else {
      res.status(400).json({ message: "Invalid user data" });
    }


  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




// Sign In Endpoint 
export const login = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({email});
    if (!user) return res.status(400).json({message: "Invalid credentials"});

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"});

    generateToken(user._id, res);

    res.status(201).json({
        _id: user._id,
        fullName: user.fullname,
        email: user.email,
        profilePic: user.profilePic,
      });

    
  } catch (error) {
    console.log("Error in login controller:", error);
    res.status(500).json({message: "Internal server error"});
  }
};





// Logout Endpoint 
export const logout = (_, res) => {
  res.cookie("jwt", "", {maxAge: 0});
  res.status(200).json({message: "Logged out successfully"});
};
