import express from "express";
import LoginController from "../controllers/login";
import MessagesController from "../controllers/messages";
import { Server } from "socket.io";

const routes = (io: Server) => {
  const router = express.Router();

  const loginController = new LoginController(io);
  const messagesController = new MessagesController(io);

  router.post("/api/login", loginController.login);
  router.post("/api/logout", loginController.logout);
  router.get("/api/messages/:roomId", messagesController.getMessages);
  router.post("/api/messages", messagesController.addMessage);

  return router;
};

export default routes;
