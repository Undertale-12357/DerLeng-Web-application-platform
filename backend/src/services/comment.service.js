import mongoose from "mongoose";
import Comment from "../models/PostComment.js"; 
import Post from "../models/Post.js";
import CommunityPost from "../models/CommunityPost.js";

const getModel = (target_type) => {
  if (target_type === "Post") return Post;
  if (target_type === "CommunityPost") return CommunityPost;

  throw new Error("Invalid target type");
};

// ✅ CREATE COMMENT
const create = async ({ target_id, target_type, user_id, content }) => {
  if (!mongoose.Types.ObjectId.isValid(target_id)) {
    throw new Error("Invalid target_id");
  }

  const Model = getModel(target_type);

  const target = await Model.findById(target_id);
  if (!target) {
    throw new Error(`${target_type} not found`);
  }

  return await Comment.create({
    target_id,
    target_type,
    user_id,
    content,
  });
};

// ✅ GET COMMENTS
const getByTarget = async (target_id, target_type) => {
  return await Comment.find({ target_id, target_type })
    .populate("user_id", "username avatar ")
    .sort({ created_at: -1 });
};

// ✅ DELETE COMMENT
const remove = async (comment_id, user_id) => {
  const comment = await Comment.findById(comment_id);

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.user_id.toString() !== user_id.toString()) {
    throw new Error("Not authorized to delete this comment");
  }

  await Comment.findByIdAndDelete(comment_id);
};

// ✅ UPDATE COMMENT
const update = async (comment_id, user_id, content) => {
  const comment = await Comment.findById(comment_id);

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.user_id.toString() !== user_id.toString()) {
    throw new Error("Not authorized to update this comment");
  }

  comment.content = content;
  await comment.save();

  return comment;
};

export default {
  create,
  getByTarget,
  remove,
  update,
};
