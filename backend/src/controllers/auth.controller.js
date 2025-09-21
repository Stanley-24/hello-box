import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";

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
  if (!email || !password) {
    return res.status(400).json({message: "Email and password are required"});
  }
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
  const isProd = ENV.NODE_ENV === "production";
  const crossSite = ENV.CLIENT_URL && !ENV.CLIENT_URL.includes("localhost");
  const sameSite = isProd && crossSite ? "none" : "lax";
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite,
    secure: isProd,
    path: "/",
  });
   res.status(200).json({message: "Logged out successfully"});
 };


export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userId = req.user._id;

    // upload new image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      resource_type: "image",
      folder: "profile_pics",
      transformation: [
        { width: 512, height: 512, crop: "limit", quality: "auto", fetch_format: "auto" },
      ],
    });

    // fetch old profilePicId before updating
    const existing = await User.findById(userId).select("profilePicId");

    // update user record
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url, profilePicId: uploadResponse.public_id },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // cleanup old Cloudinary image (fire-and-forget)
    if (existing?.profilePicId && existing.profilePicId !== uploadResponse.public_id) {
      cloudinary.uploader
        .destroy(existing.profilePicId, { invalidate: true })
        .catch((e) => console.warn("Cloudinary destroy failed:", e));
    }

    // success response
    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullname,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
    });
  } catch (error) {
    console.error("Error in updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};