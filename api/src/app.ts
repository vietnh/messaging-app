import express, { Application, Request, Response } from "express";
import http from "http";
import mongoose from "mongoose";
import socketIo, { Server as SocketIoServer, Socket } from "socket.io";
import UserModel, { User } from "./models/user";
import MessageModel, { Message } from "./models/message";
import routes from "./routes";

class ChatApp {
  private app: Application;
  private server: http.Server;
  private io: SocketIoServer;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new socketIo.Server(this.server);

    this.configureMiddleware();
    this.configureRoutes();
    this.configureSocketIO();
    this.connectToDatabase();
  }

  private configureMiddleware(): void {
    this.app.use(express.json());
  }

  private configureRoutes(): void {
    this.app.use(routes);
  }

  private configureSocketIO(): void {
    this.io.on("connection", this.handleConnection.bind(this));
  }

  private connectToDatabase(): void {
    mongoose.connect("mongodb://mongodb:27017/chatApp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  private async handleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { username, room, userId } = req.body;
      const existingUser = await UserModel.findOne({
        username,
        currentRoom: room,
      });

      if (existingUser) {
        res.status(400).json({ error: "Username is not unique in the room" });
        return;
      }

      if (userId) {
        await this.handleUserLeave(userId);
      }

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

  private handleConnection(socket: Socket): void {
    console.log("A user connected");

    socket.on("sendMessage", this.handleSendMessage.bind(this, socket));
    socket.on("disconnect", this.handleDisconnect.bind(this, socket));
  }

  private async handleSendMessage(
    socket: Socket,
    { content }: { content: string }
  ): Promise<void> {
    try {
      const user = await UserModel.findById(socket.handshake.query.userId);
      const message = await MessageModel.create({
        user: user?._id,
        content,
        roomId: user?.currentRoom,
      });

      this.io.to(user?.currentRoom).emit("message", { message });
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  }

  private async handleDisconnect(socket: Socket): Promise<void> {
    console.log("User disconnected");
    await this.handleUserLeave(socket.handshake.query.userId);
  }

  public startServer(port: number): void {
    this.server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

const chatApp = new ChatApp();
chatApp.startServer(3000);
