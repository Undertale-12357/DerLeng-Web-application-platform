import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async ({ username, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password_hash: hashedPassword,
  });

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};

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
  register,
  login,
  getAllUsers,
  getUserById,
};
