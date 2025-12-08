import jwt from "jsonwebtoken";
import asycHandler from "./asyncHandler.js";
import UserModel from "../models/userModels.js";

const authenticate = asycHandler(async (req, res, next) => {
  let token;
  //Read token from cookies
  token = req.cookies.token;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await UserModel.findById(decoded.userId).select("-password");
      next();
    }catch (error) {
      res.status(401)
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
})

const authorizeAdmin = (req, res, next) => {
  if(req.user && req.user.isAdmin) {
    next();
  } else 
    res.status(403).json( {message: "Not authorized as an admin"});
  }


export { authenticate, authorizeAdmin };