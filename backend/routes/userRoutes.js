import express from "express";
import {registerAction, loginAction, searchUser} from "../controller/userControll.js"
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router()

// All the routes 

router.post('/signUp',registerAction)
router.post('/signIn',loginAction)
router.get('/', authMiddleware, searchUser)
export default router;