import express from "express";
import { Server } from "socket.io";
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
// app.use(notFound);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://quick-chat-sai.vercel.app');
  // You can also use '*' to allow all origins
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, ()=>{console.log("server started");} );

const io = new Server(server, {
    pingTimeout: 60000,
    cors:{
        origin:"https://quick-chat-sai.vercel.app/"
    }
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
      console.log("Connected to socket.io");
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room._id);
      console.log("User Joined Room: " + room._id);
    });
    // socket.on("typing", (room) => socket.in(room).emit("typing"));
    // socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.emit("message recieved", newMessageRecieved);
      });
    });
  
    // socket.off("setup", () => {
    //   console.log("USER DISCONNECTED");
    //   socket.leave(userData._id);
    // });
  });



