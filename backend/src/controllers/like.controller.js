import likeService from "../services/like.service.js";
import Like from "../models/PostLike.js";

export const toggleLike = async (req, res) => {
  try {
    const { target_id, target_type } = req.body;

    const result = await likeService.toggleLike(
      target_id,
      target_type,
      req.user._id,
    );

    res.status(200).json({
      message: result.liked ? "Liked" : "Unliked",
      liked: result.liked,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getLikesCount = async (req, res) => {
  try {
    const { target_id, target_type } = req.query;

    const count = await likeService.getLikesCount(target_id, target_type);

    res.status(200).json({
      target_id,
      likes: count,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getLikeStatus = async (req, res) => {
  try {
    const { target_id, target_type } = req.query;

    // Use 'user_id' to match your Like schema
    const like = await Like.findOne({
      user_id: req.user._id, // <-- match schema field
      target_id,
      target_type,
    });

    res.status(200).json({ liked: !!like });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};