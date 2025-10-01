import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.js";
import User from "../models/User.js";
import mongoose from "mongoose";




export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);

  } catch (error) {
    console.log("Error in getAllContacts controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const getMessageByUserid = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userToChatId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
      ],
    }).sort({ createdAt: 1 }).lean();
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessageByUserid controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let imageUrl;
    // Basic input validation
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    if (receiverId.toString() === senderId.toString()) {
      return res.status(400).json({ message: "Cannot send message to yourself" });
    }
    if (!text && !image) {
      return res.status(400).json({ message: "Message must contain text or image" });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found" });
    }
    if (image) {
      // upload to cloudinary
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (e) {
        return res.status(400).json({ message: "Invalid image upload" });
      }
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    
    await newMessage.save();

    // todo send message in real time if user is online with socket.io
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}




export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // find all messages where the user is either sender or receiver

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId },
        { receiverId: loggedInUserId }
      ]
    });

    const chatPartnerIds = [
      ...new Set (
        messages.map(msg =>
          msg.senderId.toString() === loggedInUserId.toString()
          ? msg.receiverId.toString() 
          : msg.senderId.toString()
        )
      )
    ];

    const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");
    res.status(200).json(chatPartners);
    
  } catch (error) {
    console.log("Error in getChatPartners controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}