// export default CommunityCard;

import { Star, Heart, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

const CommunityCard = ({ post, onClick, onFavorite, onLike }) => {
  const images = post.images || [];
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);

  const creationDay = post.created_at
    ? (() => {
        const d = new Date(post.created_at);
        const month = d.toLocaleString("en-US", { month: "short" });
        return `${month} ${d.getDate()} ${d.getFullYear()}`;
      })()
    : "";

  useEffect(() => {
    if (!hover || images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [hover, images.length]);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      {/* IMAGE */}
      <div
        className="relative aspect-[1.1/1] overflow-hidden m-2 rounded-lg"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          setHover(false);
          setIndex(0);
        }}
      >
        <img
          src={images[index] || "https://via.placeholder.com/600"}
          alt={post.title}
          className="w-full h-full object-cover transition duration-500"
        />

        {/* BADGE */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-lg shadow text-xs font-bold text-[#002B11] whitespace-nowrap z-10">
          COMMUNITY SPOTLIGHT
        </div>

        {/* IMAGE COUNT */}
        {images.length > 1 && (
          <div className="absolute top-4 left-4 bg-black/40 text-white text-xs px-2 py-1 rounded-2xl backdrop-blur">
            {index + 1}/{images.length}
          </div>
        )}

        {/* FAVORITE */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.(post._id);
          }}
          className="absolute top-3 right-3 p-2 bg-black/30 rounded-full"
        >
          <Star
            size={18}
            fill={post.isFavorite ? "#FFD700" : "none"}
            className={post.isFavorite ? "text-yellow-400" : "text-white"}
          />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4 pt-1">
        <p className="text-sm font-bold uppercase text-gray-800 truncate">
          {post.title}
        </p>

        <p className="text-xs text-gray-500">
          {post.category_id?.category_name || "Community"}
        </p>

        {/* ACTIONS */}
        <div className="flex justify-between mt-2">
          {/* LIKE */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike?.(post._id);
            }}
            className="flex items-center gap-1"
          >
            <Heart
              size={16}
              fill={post.liked ? "#ef4444" : "none"}
              className={post.liked ? "text-red-500" : "text-gray-400"}
            />
            <span className="text-xs font-semibold">{post.likes || 0}</span>
          </button>
        </div> 

        {/* FOOTER */}
        <div className="flex justify-between border-t border-gray-200 pt-2 mt-2 text-xs text-gray-500">
          <span>{post.admin_id?.username || "Admin"}</span>
          <span>{creationDay}</span>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;