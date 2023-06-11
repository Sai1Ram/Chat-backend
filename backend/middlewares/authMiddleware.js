import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt  from "jsonwebtoken";
const authMiddleware = asyncHandler(async (req, resp, next) =>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        }
        catch{
            resp.sendStatus(401);
            throw new Error("TOKEN FAILED");
        }
        
    }
    if(!token){
        throw new Error("USER IS NOT AUTHORIZED")
    }
})

export default authMiddleware;