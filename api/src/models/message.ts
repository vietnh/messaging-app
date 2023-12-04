import mongoose, { Document, Schema } from "mongoose";

export interface Message {
  userName: string;
  roomId: string;
  content: string;
}

const messageSchema = new Schema<Message & Document>(
  {
    userName: {
      type: String,
      ref: "User",
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    content: {
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
