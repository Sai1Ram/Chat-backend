import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRouter.js";
import notFound from "./middlewares/middleware.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
const http_server = http.createServer(app);
dotenv.config();
connectDB();
app.use(cors());
app.use(express.json());
app.use("/auth/user", userRoutes);
app.use("/auth/chat", chatRoutes);
app.use("/auth/message", messageRouter);
app.use(notFound);

const io = new Server(http_server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`);
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (chat) => {
    console.log(`user joined ${chat}`);
    socket.join(chat);
  });

  socket.on("new message", (newMessage) => {
    let chat = newMessage.chat;
    if (!chat.users) return console.log("users not found");
    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;
      socket.in(user._id).emit("message received", newMessage);
    });
  });
});
const PORT = process.env.PORT || 5000;

http_server.listen(PORT, () => {
  console.log("server started");
});
