import api from "./api";

const toggleFavorite = async (postId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not logged in");

  // Send both target_id and target_type
  const res = await api.post(
    "/favorites/toggle",
    { target_id: postId, target_type: "Post" }, // <- important!
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data; // { isFavorite: true/false, message: ... }
};

const getUserFavorites = async () => {
  const token = localStorage.getItem("token");
  if (!token) return [];

  const res = await api.get("/favorites", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data; // array of favorites
};

export default {
  toggleFavorite,
  getUserFavorites,
};