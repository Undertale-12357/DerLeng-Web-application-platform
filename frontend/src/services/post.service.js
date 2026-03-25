//frontend\src\services\post.service.js
import api from "./api.js";

/* ---------------- GET POST ---------------- */
export const getPostById = async (postId) => {
  const res = await api.get(`/posts/${postId}`);
  return res.data;
};

const getAllPosts = async (page = 1, limit = 10) => {
  const res = await api.get(`/posts?page=${page}&limit=${limit}`);
  return { posts: res.data.data, pagination: res.data.pagination }
  // IMPORTANT: return full response
};

/* ---------------- LIKE (UPDATED) ---------------- */
const toggleLike = async (postId) => {
  const res = await api.post(`/likes/toggle`, {
    target_id: postId,
    target_type: "Post",
  });

  return res.data; // { liked: true/false }
};

const getLikesCount = async (postId) => {
  const res = await api.get(
    `/likes/count?target_id=${postId}&target_type=Post`,
  );

  return res.data.likes;
};

const getUserLikeStatus = async (postId) => {
  const res = await api.get(`/likes/status?target_id=${postId}&target_type=Post`);
  return res.data.liked;
};

/* ---------------- USER POSTS ---------------- */
export const getPostsByUser = async (userId, token) => {
  const res = await api.get(`/posts/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data || [];
};

export default {
  getAllPosts,
  toggleLike,
  getLikesCount,
  getPostById,
  getPostsByUser,
  getUserLikeStatus,
};
