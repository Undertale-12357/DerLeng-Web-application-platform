import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



const getAllUsers = async () => {
  return await User.find().select("-password_hash");
};

const getUserById = async (id) => {
  const user = await User.findById(id).select("-password_hash");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export default {
  getAllUsers,
  getUserById,
};
