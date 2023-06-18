import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { accessChat, allChat, creatGroupChat, renameGroup } from '../controller/chatController.js';
const router = express.Router()
router.post('/', authMiddleware, accessChat);
router.get('/', authMiddleware, allChat);
router.post('/group', authMiddleware, creatGroupChat);
router.put('/renameGroup', authMiddleware, renameGroup);
// router.put('/addToGroup', authMiddleware, addToGroup);
export default router