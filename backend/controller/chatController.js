import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

// ONE TO ONE CHAT FUNCTION
const accessChat = asyncHandler(async (req, resp) => {
  const { userId } = req.body; //user id send by the user by selecting one chat
  
  if (!userId) {
    console.log("PARAM NOT SEND");
    return resp.sendStatus(400);
  }
  let sender = await User.findOne({_id:userId});
  let ischat = await Chat.findOneAndUpdate({
    isGroup: false,
  users: { $all: [req.user._id, userId] },
  },
  { chatName: sender.name}, // Update the chatName field with the new value
  { new: true } )
    .populate("users", "-password")   //populate the users all data except password
    .populate("latestMessage");       //populate the all data of latestMessage

  ischat = await User.populate(ischat, {
    path: "latestMessage.sender",    //here we are selecting the name pic email of the sender of the latest message.
    select: "name pic email",
  });

  // if the chat is present then show that other wise create
  if (ischat) {
    resp.send(ischat);
  } else {
    
    let chatData = {
      chatName: sender.name,
      isGroup: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      resp.status(200).send(fullChat);
    } catch (error) {
      // error
      resp.status(400);
      throw new Error(error.message);
    }
  }
});

// FETCHING ALL THE CHAT THAT THE USER HAVING
const allChat = asyncHandler(async (req, resp) => {
  try {
    let result = await Chat.find({ users: { $in: [req.user._id] } })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("groupAdmin", "-password")
      .sort({updatedAt: -1});
    result = await User.populate(result, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    resp.status(200).send(result);
  } catch (error) {
    throw new Error(error.message);
  }
});

// CREATE A GROUP CHAT 
const creatGroupChat = asyncHandler(async(req, resp)=>{
  if(!req.body.name || !req.body.users){
    return resp.status(400).send({message: "Please fill all the field"})
  }
  let users = await JSON.parse(req.body.users);
  users.push(req.user);          // here we add the user who creating the grop 
  let groupChatData = { 
    chatName: req.body.name,
    isGroup: true,
    users: users,
    groupAdmin: req.user
  };    
  try{
    const createdGroupChat = await Chat.create(groupChatData);
    const fullChat = await Chat.findOne({ _id: createdGroupChat._id }).populate(
      "users",
      "-password"
    );
    resp.status(200).send(fullChat);
  }catch(error){
    throw new Error(error);
  }
});

// RENAME THE GROUP CHAT NAME
const renameGroup = asyncHandler( async(req, resp)=>{
  const {chatName, chatId} = req.body;
  // const user =
  console.log(req.user.isAdmin);
  const updatedChat = await Chat.findByIdAndUpdate(chatId, {chatName}, {new: true}).populate("users", "-password").populate("groupAdmin", "-password")
  if(!updatedChat){
    throw new Error("chat not found");

  }else{
    resp.json(updatedChat);
  }
});

// REMOVE MEMBERS FROM GROUP
const removeFromGroup =asyncHandler(async (req, resp) =>{
  const {chatId, userId} = req.body;
  const removedFromGroup = await Chat.findByIdAndUpdate(chatId,{$pull:{users: userId} }, {new: true}).populate("users", "-password").populate("groupAdmin", "-password");
  if(!removedFromGroup){
    throw new Error("chat not found");
  }else{
    resp.json(removedFromGroup);
  }
})

// ADDING MEMBERS TO GROUP
const addToGroup = asyncHandler(async (req, resp) =>{
    const {chatId, userId} = req.body;
    const addedUser = await Chat.findByIdAndUpdate(chatId,{$push:{users: userId} }, {new: true}).populate("users", "-password").populate("groupAdmin", "-password");
    if(!addedUser){
      throw new Error("chat not found");
  
    }else{
      resp.json(addedUser);
    }
})

// EXPORTING ALL THE FUNCTIONS
export { accessChat, allChat, creatGroupChat, renameGroup, removeFromGroup, addToGroup };
