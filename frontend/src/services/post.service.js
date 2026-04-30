//frontend\src\services\post.service.js
import api from "./api";
import axios from "axios";
/* ---------------- GET POST ---------------- */
export const getPostById = async (postId) => {
  const res = await api.get(`/posts/${postId}`);
  return res.data;
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

/* ---------------- USER POSTS ---------------- */
export const getPostsByUser = async (userId, token) => {
  const res = await api.get(`/posts/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data || [];
};

const getAllPosts = async (page = 1, limit = 10, search = "") => {
  const res = await api.get(`/posts?page=${page}&limit=${limit}&search=${search}`);
  return { posts: res.data.data, pagination: res.data.pagination }
}

/* ---------------- UPDATE POST ---------------- */
export const updatePost = async (postId, formData) => {
  const res = await api.put(`/posts/${postId}`, formData);
  return res.data;
};
/* ---------------- DELETE POST ---------------- */
export const deletePost = async (postId) => {
  const res = await api.delete(`/posts/${postId}`);
  return res.data;
};

const getTopPosts = async () => {
  const res = await api.get("/posts/top");
  return res.data;
};


const getPostsByCategory = async (categoryId, page = 1, limit = 10) => {
  const res = await api.get(
    `/posts/category/${categoryId}?page=${page}&limit=${limit}`
  );

  return res.data; // { data, pagination }
};

const getPostsByProvince = async (provinceId, page = 1, limit = 10) => {
  const res = await api.get(
    `/posts/province/${provinceId}?page=${page}&limit=${limit}`,
  );
  return res.data;
};

export default {
  getAllPosts,
  toggleLike,
  getLikesCount,
  getPostById,
  getPostsByUser,
  updatePost,
  deletePost,
  getTopPosts,
  getPostsByCategory,
  getPostsByProvince,
};
