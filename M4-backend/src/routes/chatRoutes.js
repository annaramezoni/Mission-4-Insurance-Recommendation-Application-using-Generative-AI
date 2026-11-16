import express from "express";
import { startChat, chat } from "../controllers/chatController.js";

const router = express.Router();

router.post("/startChat", startChat);

router.post("/chat", chat);

export default router;
