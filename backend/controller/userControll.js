import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../config/generateToken.js";
import bcrypt from "bcrypt";

// All the function

const registerAction = asyncHandler(async (req, resp) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    resp.status(400);
    throw new Error("Please fill the field");
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    resp.status(400);
    throw new Error("User already Exists");
  } else {
    const userInfo = {
      name: name.trim(),
      email: email.trim(),
      password: password
    };
    const user = await User.create(userInfo);
    if (user) {
      resp
        .status(201)
        .json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
    } else {
      resp.status(400);
    }
  }
});
const loginAction = asyncHandler(async (req, resp) => {
  const { email, password } = req.body;
  if (!email || !password) {
    resp.status(400).json({ message: "Please fill the field" });
  }
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    resp
      .status(200)
      .json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        message: "Login Successful",
      });
  } else {
    resp.status(403).json({ message: "Wrong email or password" });
  }
});


const searchUser = asyncHandler(async (req, resp) => {
  const searchQuery = req.query.search;
  if(!searchQuery){
    resp.send([]);
    return
  }
  const keyword =  { name: { $regex: req.query.search, $options: "i" } } 
  const users = await User.find({ ...keyword, _id: { $ne: req.user._id } }).select("-password");
  resp.send(users);
});

export { registerAction, loginAction, searchUser };
