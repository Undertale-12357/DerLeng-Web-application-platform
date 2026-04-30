import { useNavigate } from "react-router-dom";
import useTravelStories from "../hooks/useTravelStories";
import StoryCard from "../components/stories/StoryCard";
import FeaturedStories from "../components/stories/FeaturedStories";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import Spinner from "../components/Spinner";
import { useState } from "react";
import EditPostModal from "../components/EditPostModal";
import { deletePost } from "../services/post.service";
import { Toaster } from "react-hot-toast";
import SearchModal from "../components/SearchModal";
import { useDiscover } from "../hooks/useDiscover";
import { provinceImages } from "../data/imageMap";
import { normalize } from "../utils/normalize";

export default function TravelStories() {
  const {
    posts,
    loading,
    toggleLikePost,
    toggleFavoritePost,
    page,
    setPage,
    totalPages,
    topPosts,
  } = useTravelStories();

  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { provinces, loading: loadingProvinces } = useDiscover();
  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setShowEditModal(true);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you wanwwt to delete this post?")) return;

    try {
      await deletePost(postId);

      // 🔥 refresh posts (simple way)
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-[200vh] bg-white">
        <Spinner></Spinner>
      </div>
    );

  const getPagination = (current, total) => {
    const delta = 2;
    const range = [];

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(total - 1, current + delta);
      i++
    ) {
      range.push(i);
    }

    if (current - delta > 2) range.unshift("...");
    if (current + delta < total - 1) range.push("...");

    range.unshift(1);
    if (total !== 1) range.push(total);

    return range;
  };
  const pages = getPagination(page, totalPages);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="min-h-screen bg-white"
    >
      <Toaster position="top-center" reverseOrder={false} />
      <FeaturedStories
        posts={topPosts}
        onFavorite={toggleFavoritePost}
        onLike={toggleLikePost}
      />
      {/* HEADER */}
      <section className="px-8 py-4 max-w-[1600px] mx-auto sticky top-0 bg-white z-50 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          {/* LEFT SIDE TITLE */}
          <div>
            <h1 className="text-3xl font-bold text-[#002B11]">
              Travel Stories
            </h1>
            <p className="text-gray-500">
              Discover experiences from our community
            </p>
          </div>

          {/* RIGHT SIDE SEARCH */}
          <div className="flex space-x-4 items-center w-full md:w-auto">
            {/* OPTIONAL BUTTON (extra UX) */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="flex items-center gap-2 border border-gray-100  px-3 py-2 rounded-xl hover:bg-gray-50"
            >
              <Search size={16} />
              Search
            </button>
          </div>
        </div>
      </section>
      {/* PROVINCES */}
      <section className="px-6 py-6 bg-white">
        <h2 className="text-2xl font-bold mb-6">Explore by Province</h2>

        {loadingProvinces ? (
          <p>Loading provinces...</p>
        ) : (
          <div className="flex space-x-4 overflow-x-auto">
            {provinces.map((prov) => {
              const key = normalize(prov.province_name);

              return (
                <div
                  key={prov._id}
                  onClick={() => navigate(`/posts/province/${prov._id}`)}
                  className="flex flex-col items-center min-w-[90px] cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden shadow hover:scale-105 transition">
                    <img
                      src={
                        provinceImages[key] ||
                        "https://i.pinimg.com/control1/736x/81/56/ca/8156caed38c05bdacc7a326572595dba.jpg"
                      }
                      alt={prov.province_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <span className="mt-2 text-sm text-center text-gray-700">
                    {prov.province_name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* POSTS */}
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-100 animate-pulse rounded-lg"
              />
            ))
          : posts.map((post) => (
              <StoryCard
                key={post._id}
                post={post}
                onLike={toggleLikePost}
                onFavorite={toggleFavoritePost}
                onClick={() => handlePostClick(post._id)}
                // ✅ ADD THESE
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
      </div>

      {/* PAGINATION */}
      {/* <div className="flex justify-center mt-8 gap-2 mb-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded-md ${
              page === i + 1 ? "bg-green-500 text-white" : "bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div> */}

      <div className="flex items-center justify-center gap-2 mt-8 mb-4">
        {/* Prev */}
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-40"
        >
          Prev
        </button>

        {/* Pages */}
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-2 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${
                page === p ? "bg-green-500 text-white" : "bg-gray-100"
              }`}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-40"
        >
          Next
        </button>
      </div>
      {showEditModal && (
        <EditPostModal
          post={selectedPost}
          onClose={() => setShowEditModal(false)}
          onUpdated={() => {
            setShowEditModal(false);
            window.location.reload(); // refresh list
          }}
        />
      )}
      {showSearchModal && (
        <SearchModal onClose={() => setShowSearchModal(false)} />
      )}
    </motion.div>
  );
}
