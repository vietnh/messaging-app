import mongoose, { Document, Schema } from "mongoose";

interface Message {
  userId: mongoose.Types.ObjectId;
  roomId: string;
  message: string;
}

const messageSchema = new Schema<Message & Document>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model<Message & Document>(
  "Message",
  messageSchema
);

export default MessageModel;
