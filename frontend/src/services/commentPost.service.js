import api from "./api";

/* ---------------- GET COMMENTS ---------------- */
const getCommentsByPost = async (postId) => {
  const res = await api.get(`/comments/post/${postId}`);
  return res.data;
};

/* ---------------- ADD COMMENT ---------------- */
const addComment = async (postId, content) => {
  const res = await api.post(`/comments`, {
    post_id: postId,
    content,
  });
  return res.data;
};

/* ---------------- DELETE COMMENT ---------------- */
const deleteComment = async (commentId) => {
  const res = await api.delete(`/comments/${commentId}`);
  return res.data;
};

/* ---------------- UPDATE COMMENT ---------------- */
const updateComment = async (commentId, content) => {
  const res = await api.put(`/comments/${commentId}`, { content });
  return res.data;
};

export default {
  getCommentsByPost,
  addComment,
  deleteComment,
  updateComment,
};