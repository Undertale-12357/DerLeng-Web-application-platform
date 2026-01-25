import bcrypt from "bcryptjs";
import User from "../models/User.js";
import EmailVerification from "../models/EmailVerification.js";
import sendVerificationEmail from "./email.service.js";

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
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

const sendCode = async (email) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("Email already registered");
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  await EmailVerification.findOneAndUpdate(
    { email },
    {
      email,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
    },
    { upsert: true },
  );
  await sendVerificationEmail(email, code);
};

const verifyCodeAndRegister = async ({ email, code, username, password }) => {
  const record = await EmailVerification.findOne({ email });

  if (!record) throw new Error("No verification code found");
  if (record.code !== code) throw new Error("Invalid verification code");
  if (record.expiresAt < new Date()) throw new Error("Code expired");
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password_hash: hashedPassword,
  });
  await EmailVerification.deleteOne({ email });
  return {
    id: user._id,
    username: user.username,
    email: user.email,
  };
};

export default {
  login,
  sendCode,
  verifyCodeAndRegister,
};
