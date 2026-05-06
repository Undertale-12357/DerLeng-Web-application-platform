import api from "./api.js";

// Get all community posts
const getAllCommunityPosts = async (page = 1, limit = 10) => {
  const res = await api.get(
    `/community-posts?page=${page}&limit=${limit}`
  );

  return res.data; // now includes posts + pagination
};

// Get community post by ID
const getCommunityPostById = async (id) => {
  const res = await api.get(`/community-posts/${id}`);
  return res.data.data || res.data;
};

// Create community post (admin)
const createCommunityPost = async (formData, token) => {
  const res = await api.post("/community-posts", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// Update community post
const updateCommunityPost = async (id, formData, token) => {
  const res = await api.put(`/community-posts/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// Delete community post
const deleteCommunityPost = async (id, token) => {
  const res = await api.delete(`/community-posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

const getByProvince = async (provinceId, page = 1, limit = 10) => {
  const res = await api.get(
    `/community-posts/province/${provinceId}?page=${page}&limit=${limit}`
  );

  return res.data;
};
export default {
  getAllCommunityPosts,
  getCommunityPostById,
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
  getByProvince,
};
