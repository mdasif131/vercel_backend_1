import bcrypt from "bcryptjs";
import asycHandler from "../middleware/asyncHandler.js";
import UserModel from "../models/userModels.js";
import generateToken from "../utils/createToken.js";

export const createUser = asycHandler(async (req, res) => {
  const { username, email, password } = req.body; 
  if (!username || !email || !password) {
    res.status(400).json({ message: "Please fill all the fields" });
  }
  const userExists = await UserModel.findOne({ email })
  if (userExists) res.status(400).json({ message: "User already exists" });


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new UserModel({ username, email, password:hashedPassword });
  
  try {
    await newUser.save();
    generateToken(res, newUser._id);
    res.status(201).json({
      status: "success",
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(404)
    throw new Error("Invalid user data");
  }
  
  })


export const loginUser = asycHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password); 

    if (isPasswordCorrect) {
      generateToken(res, existingUser._id);
      res.status(200).json({
        status: "success",
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });
    }
  } else {
    res.status(401)
    throw new Error("Invalid email or password")
  }
})

export const logoutUser = asycHandler(async (req, res) => {
res.cookie("token", "", {
  httpOnly: true,
  expires: new Date(0)
})
res.status(200).json({message:"Logged out successfully"})
}) 

export const getAllUsers = asycHandler(async (req, res) => {
  const users = await UserModel.find({})
  return res.status(200).json(users)
})

export const getCurrentUserProfile = asycHandler(async (req, res) => { 
  const user = await UserModel.findById(req.user._id).select("-password")
  if(!user) {
    res.status(404)
    throw new Error("User not found")
  }
  return res.status(200).json(user)
})

export const updateCurrentUserProfile = asycHandler(async (req, res) => { 
  const user = await UserModel.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) { 
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword
    }
  } else {
    res.status(404)
    throw new Error("User not found")
  }

  const updatedUser = await user.save(); 
  res.status(200).json({
    status: "success",
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  })
})

export const deleteUserById = asycHandler(async (req, res) => { 
  const user = await UserModel.findById(req.params.id); 
  
  if (user) {
    if(user.isAdmin) {
      res.status(400)
      throw new Error("Cannot delete admin user")
    }
    await UserModel.deleteOne({ _id: user._id });
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(404)
    throw new Error("User not found.")
  }
}) 

export const getUserById = asycHandler(async (req, res) => { 
  const user = await UserModel.findById(req.params.id).select("-password");   
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404)
    throw new Error("User not found.")
  }

})

export const updateuserById = asycHandler(async (req, res) => { 
  const user = await UserModel.findById(req.params.id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();
    res.status(200).json({
      status: "success",
      _id: updatedUser._id, 
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  }
})