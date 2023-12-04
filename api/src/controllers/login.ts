import { RequestHandler } from "express";
import { Server } from "socket.io";
import UserModel from "../models/user";

interface LoginCredentials {
  userName: string;
  roomId: string;
}

class LoginController {
  constructor(private io: Server) {}

  login: RequestHandler<{}, {}, LoginCredentials> = async (req, res) => {
    try {
      const { userName, roomId } = req.body;

      const existingUser = await UserModel.findOne({
        userName: userName,
        activeRoomId: roomId,
      });
      if (existingUser) {
        res
          .status(400)
          .json({ error: "Username already exists.", field: "userName" });
        return;
      }

      await UserModel.create({ userName: userName, activeRoomId: roomId });

      res.status(200).json({ userName: userName, activeRoomId: roomId });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  logout: RequestHandler<{}, {}, LoginCredentials> = async (req, res) => {
    try {
      const { userName, roomId } = req.body;

      const existingUser = await UserModel.findOne({
        userName: userName,
        activeRoomId: roomId,
      });

      if (!existingUser) {
        res
          .status(400)
          .json({ error: "User does not exists." });
        return;
      }

      await UserModel.deleteOne({ userName: userName, activeRoomId: roomId });

      res.status(200).json(true);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

export default LoginController;
