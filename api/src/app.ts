import express, { Application } from "express";
import http from "http";
import mongoose from "mongoose";
import { Server as SocketIoServer, Socket } from "socket.io";
import MessageModel, { Message } from "./models/message";
import routes from "./routes";
import cors from "cors";
import { SocketEvent } from "./interfaces/socket";
import { findByNameAndRoomId } from "./repositories/users";

class ChatApp {
  private app: Application;
  private server: http.Server;
  private io: SocketIoServer;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new SocketIoServer(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

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

  private async connectToDatabase(): Promise<void> {
    await mongoose.connect("mongodb://localhost:27017/chatApp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    const messageCount = await MessageModel.countDocuments();

    if (messageCount === 0) {
      const messages = Array.from({ length: 50 }).map((_, i) => ({
        userName: i % 2 === 0 ? "viet" : "hanh",
        content: `This is message ${i + 1}`,
        roomId: "1000",
      }));

      await MessageModel.insertMany(messages);
    }
  }

  private async handleConnection(socket: Socket): Promise<void> {
    console.log("A user connected");

    const user = await findByNameAndRoomId(
      socket.handshake.query.userName as string,
      socket.handshake.query.roomId as string
    );

    socket.join(user.activeRoomId);
    socket.on(SocketEvent.SEND_MESSAGE, async (data) => {
      const message = await this.handleSendMessage(socket, data);
      this.io.to(user.activeRoomId).emit(SocketEvent.RECEIVE_MESSAGE, message);
    });
    socket.on("disconnect", this.handleDisconnect.bind(this, socket));
  }

  private async handleSendMessage(socket: Socket, data: any): Promise<Message> {
    try {
      const user = await findByNameAndRoomId(
        socket.handshake.query.userName as string,
        socket.handshake.query.roomId as string
      );

      return await MessageModel.create({
        userName: user.userName,
        roomId: user.activeRoomId,
        content: data.message,
      });
    } catch (error: any) {
      throw error("Error sending message:", error.message);
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
