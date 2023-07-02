import express from "express";
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import messageRouter from "./routes/messageRouter.js"
import notFound from "./middlewares/middleware.js"
import cors from "cors"


const app = express();
dotenv.config()
connectDB();
app.use(cors())
app.use(express.json());
app.use("/auth/user", userRoutes);
app.use("/auth/chat", chatRoutes);
app.use("/auth/message", messageRouter);
app.use(notFound);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{console.log("server started");} );






