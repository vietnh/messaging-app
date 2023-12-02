import express, { Application } from "express";
import http from "http";
import mongoose from "mongoose";
import socketIo, { Server as SocketIoServer, Socket } from "socket.io";
import UserModel from "./models/user";
import MessageModel from "./models/message";

const app: Application = express();
const server: http.Server = http.createServer(app);
const io: SocketIoServer = new socketIo.Server(server);

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

mongoose.connect("mongodb://mongodb:27017/messaging-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
