import express, { Application } from "express";
import http from "http";
import mongoose from "mongoose";
import { Server as SocketIoServer, Socket } from "socket.io";
import UserModel from "./models/user";
import MessageModel from "./models/message";
import routes from "./routes";
import cors from "cors";

class ChatApp {
  private app: Application;
  private server: http.Server;
  private io: SocketIoServer;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new SocketIoServer(this.server);

    this.configureMiddleware();
    this.configureRoutes();
    this.configureSocketIO();
    this.connectToDatabase();
  }

  private configureMiddleware(): void {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private configureRoutes(): void {
    this.app.use(routes(this.io));
  }

  private configureSocketIO(): void {
    this.io.on("connection", this.handleConnection.bind(this));
  }

  private connectToDatabase(): void {
    mongoose.connect("mongodb://localhost:27017/chatApp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
  }

  // private async handleUserJoin(username: string, room: string): Promise<void> {
  //   this.io.to(room).emit("userJoined", { username });

  //   const user = await UserModel.findOneAndUpdate(
  //     { username },
  //     { username, currentRoom: room },
  //     { upsert: true, new: true }
  //   );

  //   const messages = await MessageModel.find({ roomId: room }).populate("user");
  //   this.io.to(user.currentRoom).emit("roomMessages", { messages });
  // }

  // private async handleUserLeave(userId: string): Promise<void> {
  //   const user = await UserModel.findById(userId);
  //   if (user) {
  //     this.io
  //       .to(user.currentRoom)
  //       .emit("userLeft", { username: user.username });
  //   }
  // }

  private handleConnection(socket: Socket): void {
    console.log("A user connected");

    this.io.emit("new_message", { content: "Hello from server", username: "Admin", roomId: '1000' })

    socket.on("new_message", this.handleSendMessage.bind(this, socket));
    socket.on("disconnect", this.handleDisconnect.bind(this, socket));
  }

  private async handleSendMessage(
    socket: Socket,
    { content }: { content: string }
  ): Promise<void> {
    try {
      const user = await UserModel.findById(socket.handshake.query.userId);
      if (!user) {
        throw new Error("User not found");
      }

      const message = await MessageModel.create({
        user: user._id,
        content,
        roomId: user?.activeRoomId,
      });

      this.io.to(user.activeRoomId).emit("message", { message });
    } catch (error: any) {
      console.error("Error sending message:", error.message);
    }
  }

  private async handleDisconnect(socket: Socket): Promise<void> {
    console.log("User disconnected", socket.handshake.query.userId);
    // await this.handleUserLeave(socket.handshake.query.userId);
  }

  public startServer(port: number): void {
    this.server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

const chatApp = new ChatApp();
chatApp.startServer(5000);
