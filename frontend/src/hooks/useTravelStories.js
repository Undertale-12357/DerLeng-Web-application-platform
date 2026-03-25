// // frontend\src\hooks\useTravelStories.js
// import { useState, useEffect } from "react";
// import postService from "../services/post.service";
// import favoritePostService from "../services/favoritepost.service";

// const useTravelStories = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);

//   const fetchPosts = async (page = 1) => {
//   try {
//     setLoading(true);

//     //get posts
//     const res = await postService.getAllPosts(page, 10);
//     const postsArray = res.posts;
//     //get favorites
//     const token = localStorage.getItem("token")
//     const favorites = await favoritePostService.getUserFavorites(token);
//     console.log("favorites:", favorites);
//     const favoriteIds = favorites.data.map((f) => f.post_id);

//     const postsWithLikes = await Promise.all(
//       postsArray.map(async (post) => {
//         const [likes, liked] = await Promise.all([
//           postService.getLikesCount(post._id),
//           postService.getUserLikeStatus(post._id),
//         ]);

//         return { ...post, likes, liked,isFavorite: favoriteIds.includes(post._id) };
//       })
//     );

//     setPosts(postsWithLikes);
//     setTotalPages(res.pagination.pages); // 👈 ADD THIS
//   } catch (err) {
//     console.error(err);
//   } finally {
//     setLoading(false);
//   }
// };

//   const toggleLikePost = async (postId) => {
//     try {
//       const result = await postService.toggleLike(postId);
//       setPosts((prev) =>
//         prev.map((post) =>
//           post._id === postId
//             ? {
//                 ...post,
//                 liked: result.liked,
//                 likes: result.liked ? post.likes + 1 : post.likes - 1,
//               }
//             : post
//         )
//       );
//     } catch (err) {
//       console.error("Error toggling like:", err.message);
//     }
//   };

//   return { posts, loading, toggleLikePost,fetchPosts,totalPages };
// };

// export default useTravelStories;
// frontend/src/hooks/useTravelStories.js
import { useState, useEffect } from "react";
import postService from "../services/post.service";
import favoritePostService from "../services/favoritepost.service";

const useTravelStories = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);

      // --- 1. Get all posts ---
      const res = await postService.getAllPosts(page, 10);
      const postsArray = res.posts || [];

      // --- 2. Check if user is logged in ---
      const token = localStorage.getItem("token");
      // --- 3. Get user favorites safely ---
      const favorites = token
        ? await favoritePostService.getUserFavorites()
        : [];
      // const favoriteIds = favorites.data.map((f) => f.post_id);
      const favoriteIds = Array.isArray(favorites) ? favorites.map(f => f.post_id) : favorites.data.map((f) => f.post_id) ;
      // --- 4. Map posts with likes, liked status, and isFavorite ---
      const postsWithLikes = await Promise.all(
        postsArray.map(async (post) => {
          const [likes, liked] = await Promise.all([
            postService.getLikesCount(post._id),
            token ? postService.getUserLikeStatus(post._id) : false,
          ]);

          return {
            ...post,
            likes,
            liked,
            isFavorite: favoriteIds.includes(post._id),
          };
        })
      );

      setPosts(postsWithLikes);
      setTotalPages(res.pagination?.pages || 1);
    } catch (err) {
      console.error("Failed to fetch travel stories:", err.message);
      setPosts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // --- Toggle like for a post ---
  const toggleLikePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return; // optional: you can show login modal

      const result = await postService.toggleLike(postId);
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                liked: result.liked,
                likes: result.liked ? post.likes + 1 : post.likes - 1,
              }
            : post
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err.message);
    }
  };

  // --- Toggle favorite for a post ---
  const toggleFavoritePost = async (postId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in");

    const result = await favoritePostService.toggleFavorite(postId);

    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId ? { ...post, isFavorite: result.isFavorite } : post
      )
    );
  } catch (err) {
    console.error("Error toggling favorite:", err.message);
  }
};

  return {
    posts,
    loading,
    totalPages,
    fetchPosts,
    toggleLikePost,
    toggleFavoritePost,
  };
};

export default useTravelStories;