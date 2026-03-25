//frontend\src\services\favorite.service.js
import api from "./api";

/* ---------------- TOGGLE FAVORITE ---------------- */
export const toggleFavorite = async (targetId, targetType, token) => {
  const res = await api.post(
    `/favorites/toggle`,
    {
      target_id: targetId,
      target_type: targetType,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data; // { isFavorite: true/false }
};

/* ---------------- GET USER FAVORITES ---------------- */
export const getFavorites = async (targetType, token) => {
  const res = await api.get(
    `/favorites${targetType ? `?target_type=${targetType}` : ""}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data.data;
};

export default {
  toggleFavorite,
  getFavorites,
};
