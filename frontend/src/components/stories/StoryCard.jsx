// frontend/src/components/stories/StoryCard.jsx
import { Heart, MoreVertical, Star } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";


const StoryCard = ({
  post,
  onLike,
  onFavorite,
  onClick,
  onEdit,
  onDelete,
}) => {
  const images = post.images || [];
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { user } = useContext(AuthContext);
  const currentUserId = user?._id || user?.id || null;

  const isOwner =
    post.user_id?._id?.toString() === currentUserId ||
    post.user_id?.toString() === currentUserId;

  const creationDay = post.created_at
    ? (() => {
        const d = new Date(post.created_at);
        const month = d.toLocaleString("en-US", { month: "short" });
        const day = d.getDate();
        const year = d.getFullYear();
        return `${month} ${day} ${year}`;
      })()
    : "";

  // Auto slide images on hover (UNCHANGED)
  useEffect(() => {
    if (!hover || images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [hover, images.length]);

  // reset index if images change (UNCHANGED)
  useEffect(() => {
    setIndex(0);
  }, [images.length]);

  return (
    <div
      className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 max-w-sm border border-gray-100"
      onClick={onClick}
    >
      <div
        className="relative aspect-[1.1/1] overflow-hidden m-2 rounded-lg"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          setHover(false);
          setIndex(0);
        }}
      >
        <img
          src={
            images.length > 0
              ? images[index]
              : "https://via.placeholder.com/600"
          }
          alt={post.title}
          className="w-full h-full object-cover transition duration-500"
        />

        {images.length > 1 && (
          <div className="absolute top-4 left-4 bg-black/40 text-white text-xs px-2 py-1 rounded-2xl backdrop-blur">
            {index + 1}/{images.length}
          </div>
        )}

        {/* FAVORITE BUTTON (UNCHANGED) */}
{/* 3 DOT MENU FIRST */}
<div className="absolute top-4 right-4 flex items-center gap-2">
  
  {/* STAR (always visible, always at end) */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      onFavorite?.(post._id);
    }}
    className="p-2 bg-black/20 backdrop-blur-md rounded-full hover:bg-black/40 transition"
  >
    <Star
      size={18}
      fill={post.favorited ? "#FFD700" : "none"}
      className={post.favorited ? "text-yellow-400" : "text-white"}
    />
  </button>

  {/* MENU (ONLY OWNER) */}
  {isOwner && (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu((prev) => !prev);
        }}
        className="p-2 bg-black/30 text-white rounded-full hover:bg-black/60 transition flex items-center justify-center"
      >
        <MoreVertical size={18} />
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-28 bg-white shadow-lg rounded-md  z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
              onEdit?.(post);
            }}
            className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-all"
          >
          Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
              onDelete?.(post._id);
            }}
            className="block w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )}

</div>
</div>
      {/* CONTENT (UNCHANGED EXACTLY) */}
      <div className="p-4 pt-1">
        <p className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          {post.title}
        </p>

        <div className="flex justify-between items-center mb-1">
          <p className="text-xs opacity-80">
            {post.category_id?.category_name || ""}
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike?.(post._id);
            }}
            className="flex items-center gap-1 transition"
          >
            <Heart
              size={18}
              fill={post.liked ? "#ef4444" : "none"}
              className={post.liked ? "text-red-500" : "text-gray-400"}
            />

            <span>
              {typeof post.likes === "number"
                ? post.likes
                : typeof post.likes === "object"
                ? post.likes.likes || post.likes.count || 11
                : 0}
            </span>
          </button>
        </div>

        <p className="text-xs text-gray-500 flex justify-between border-t border-gray-100 pt-1">
          <span className="font-medium text-gray-700">
            By {post.user_id?.username || "Unknown"}
          </span>
          <span>{creationDay}</span>
        </p>
      </div>
    </div>
  );
};

export default StoryCard;