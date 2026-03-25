import {
  toggleFavoriteService,
  getUserFavoritesService,
} from "../services/favorite.service.js";

/* ---------------- TOGGLE ---------------- */
export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { target_id, target_type } = req.body;
    console.log("toggleFavorite payload:", { userId, target_id, target_type });

    const result = await toggleFavoriteService(userId, target_id, target_type);

    res.json({
      message: result.favorited
        ? "Added to favorites"
        : "Removed from favorites",
      isFavorite: result.favorited,
    });
  } catch (error) {
    console.error("toggleFavorite error:", error); 
    res.status(500).json({ message: error.message });
  }
};


/* ---------------- GET FAVORITES ---------------- */
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const { target_type } = req.query; // optional filter

    const favorites = await getUserFavoritesService(
      userId,
      target_type
    );

    res.json({ data: favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};