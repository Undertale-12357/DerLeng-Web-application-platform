import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["normal_user", "admin"],
      default: "normal_user",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

export default mongoose.model("User", userSchema);
