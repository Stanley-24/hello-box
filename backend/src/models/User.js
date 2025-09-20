import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Enforce unique email
      lowercase: true,
      trim: true,
      index: true, // Ensure an index is created to back uniqueness
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: " ",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;