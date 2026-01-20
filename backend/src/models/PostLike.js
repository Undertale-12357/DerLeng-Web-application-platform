import mongoose from "mongoose";

const postLikeSchema = new mongoose.Schema(
  {
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

// Prevent duplicate likes by same user on same post
postLikeSchema.index({ post_id: 1, user_id: 1 }, { unique: true });

export default mongoose.model("PostLike", postLikeSchema);
