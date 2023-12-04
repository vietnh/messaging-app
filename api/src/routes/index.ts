import express from "express";
import loginController from "../controllers/login";
import messagesController from "../controllers/messages";

const router = express.Router();

router.post("/api/login", loginController.handleLogin);

export default router;
