import { Server, Socket } from "socket.io";
import { RequestHandler } from "express";
import MessageModel, { Message } from "../models/message";

class MessagesController {
  constructor(private io: Server) {}

  getMessages: RequestHandler<{ roomId: string }> = async (req, res) => {
    try {
      const messages = await MessageModel.find({
        roomId: req.params.roomId,
      }).sort({ createdAt: -1 });
      return res.json(messages);
    } catch (error: any) {
      console.error("Error getting messages:", error.message);
      throw error;
    }
  };

  addMessage: RequestHandler<{}, {}, Message> = async (req, res) => {
    try {
      const { content, roomId, userName } = req.body;

      const message = await MessageModel.create({
        content,
        roomId,
        userName,
      });

      this.io.to(roomId).emit("receive_message", message);

      res.status(201).json({ message });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default MessagesController;
