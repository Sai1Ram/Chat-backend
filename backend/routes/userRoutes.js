import express from "express";
import {registerAction, authUser} from "../controller/userControll.js"

const router = express.Router()

// All the routes 

router.post('/signUp',registerAction)
router.post('/signIn',authUser)

export default router;