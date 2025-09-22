import mongoose from "mongoose";


const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);
// Require at least one of text or image
messageSchema.pre('validate', function (next) {
  if (!this.text && !this.image) {
    return next(new Error("Message must contain text or image"));
  }
  next();
});
// Speed up common lookups and ordering
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });
const Message = mongoose.model("Message", messageSchema);
export default Message;