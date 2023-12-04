import { Socket } from "socket.io";
import UserModel from "../models/user";
import MessageModel from "../models/message";

class MessagesController {
  async handleSendMessage(
    socket: Socket,
    { content }: { content: string }
  ): Promise<void> {
    try {
      // Handle send message logic
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    console.log("User disconnected");
    // Handle user leave logic
  }
}

export default new MessagesController();
