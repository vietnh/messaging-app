import { Request, Response } from "express";
import { Server as SocketIoServer } from "socket.io";
import UserModel from "../models/user";
import MessageModel from "../models/message";

class LoginController {
  private io: SocketIoServer;

  constructor(io: SocketIoServer) {
    this.io = io;
  }

  async handleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { username, room, userId } = req.body;

      // Check if the username is unique in the room
      const existingUser = await UserModel.findOne({
        username,
        currentRoom: room,
      });
      if (existingUser) {
        res.status(400).json({ error: "Username already exists." });
        return; 
      }

      // Leave the current room if the user was in any
      if (userId) {
        await this.handleUserLeave(userId);
      }

      // Join the new room
      await this.handleUserJoin(username, room);

      res.status(200).json({ user: existingUser });
    } catch (error) {
      console.error("Error handling login:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  private async handleUserJoin(username: string, room: string): Promise<void> {
    this.io.to(room).emit("userJoined", { username });

    const user = await UserModel.findOneAndUpdate(
      { username },
      { username, currentRoom: room },
      { upsert: true, new: true }
    );

    const messages = await MessageModel.find({ roomId: room }).populate("user");
    this.io.to(user.currentRoom).emit("roomMessages", { messages });
  }

  private async handleUserLeave(userId: string): Promise<void> {
    const user = await UserModel.findById(userId);
    if (user) {
      this.io
        .to(user.currentRoom)
        .emit("userLeft", { username: user.username });
    }
  }
}

export default LoginController;
