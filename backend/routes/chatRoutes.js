import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { accessChat, allChat, creatGroupChat, removeFromGroup, renameGroup, addToGroup } from '../controller/chatController.js';
const router = express.Router()
router.post('/', authMiddleware, accessChat);
router.get('/', authMiddleware, allChat);
router.post('/group', authMiddleware, creatGroupChat);
router.put('/renameGroup', authMiddleware, renameGroup);
router.put('/removeFromGroup', authMiddleware, removeFromGroup);
router.put('/addToGroup', authMiddleware, addToGroup);
export default router