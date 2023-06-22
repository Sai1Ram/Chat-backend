import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js'
import { allMessages, sendMessage } from '../controller/messageController.js';
const router = express.Router()
router.route("/:chatId").get(authMiddleware, allMessages);
router.route("/").post(authMiddleware, sendMessage);
export default router