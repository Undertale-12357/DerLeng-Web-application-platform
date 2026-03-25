//frontend\src\pages\PostDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import postService from "../services/post.service";
import commentService from "../services/commentPost.service";

import {
  Heart,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Send,
  Trash2,
  ArrowLeft,
  MoreVertical,
  Edit,
} from "lucide-react";
import PostLoginPromptModal from "../components/PostLoginPromptModal";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const token = localStorage.getItem("token");
  const currentUser = token ? JSON.parse(atob(token.split(".")[1])) : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const postData = await postService.getPostById(id);
        setPost(postData.data);

        const likesCount = await postService.getLikesCount(id);
        setLikes(likesCount);

        const commentsData = await commentService.getCommentsByPost(id);
        setComments(commentsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleNextImage = () => {
    if (post.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
    }
  };

  const handlePrevImage = () => {
    if (post.images?.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + post.images.length) % post.images.length,
      );
    }
  };

  const handleLike = async () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    try {
      const res = await postService.toggleLike(id);
      setLiked(res.liked);
      setLikes((prev) => (res.liked ? prev + 1 : prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

    const handleDeleteComment = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async () => {
  if (!token) return setShowLoginModal(true);
  if (!newComment.trim()) return;

  try {
    const comment = await commentService.addComment(id, newComment);
    setComments([comment, ...comments]);
    setNewComment("");
  } catch (err) {
    console.error(err);
  }
  };
  const handleEditComment = async (commentId) => {
  try {
    const updated = await commentService.updateComment(
      commentId,
      editText
    );

    setComments((prev) =>
      prev.map((c) => (c._id === commentId ? updated : c))
    );

    setEditingId(null);
    setOpenMenuId(null);
  } catch (err) {
    console.error(err);
  }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading Story...
      </div>
    );
  if (!post) return <div className="text-center mt-20">Post not found</div>;

  return (
    <>
      <PostLoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={() => {
          setShowLoginModal(false);
          navigate("/login"); // redirect to login page
        }}
      />
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 right-4 md:left-6 md:right-auto z-50 bg-white shadow-md p-3 rounded-full hover:bg-gray-100 transition"
      >
        <ArrowLeft size={22} />
      </button>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        {/* --- HEADER --- */}

        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-bold text-[#002B11]">{post.title}</h1>
            <div className="flex flex-wrap gap-3 items-center text-gray-500 text-sm">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                {post.category_id?.category_name}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {post.province_id?.province_name}
              </span>
              <span>
                By{" "}
                <span className="font-semibold text-gray-800">
                  {post.user_id?.username || "Traveler"}
                </span>
              </span>
            </div>
          </div>
          <button
            onClick={handleLike}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full  transition duration-300 self-start"
          >
            <Heart
              size={24}
              className={liked ? "fill-red-500 text-red-500" : "text-gray-400"}
            />
            <span
              className={`font-bold ${liked ? "text-red-500" : "text-gray-600"}`}
            >
              {likes}
            </span>
          </button>
        </div>

        {/* --- IMAGE CAROUSEL WITH BLUR EFFECT --- */}
        <div className="relative flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 h-[600px] rounded-2xl overflow-hidden shadow-lg bg-black">
            {post.images && post.images.length > 0 ? (
              <>
                {/* Blurred Background */}
                <div
                  className="absolute inset-0 bg-center bg-cover filter blur-xl scale-110"
                  style={{
                    backgroundImage: `url(${post.images[currentImageIndex]})`,
                  }}
                />
                {/* Optional: dark overlay */}
                <div className="absolute inset-0 bg-black/30"></div>

                {/* Main Image */}
                <img
                  src={post.images[currentImageIndex]}
                  alt="Travel"
                  className="relative w-full h-full object-contain transition duration-700 rounded-2xl"
                />

                {/* Navigation */}
                {post.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-3 rounded-full"
                    >
                      <ChevronLeft size={28} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-3 rounded-full"
                    >
                      <ChevronRight size={28} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-100">
                No images
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {post.images?.length > 1 && (
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden md:w-20">
              {post.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${idx === currentImageIndex ? "border-green-500" : "border-transparent"}`}
                  onClick={() => setCurrentImageIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* --- OVERVIEW & TRIP DETAILS --- */}
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overview */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-800">Trip Story</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
          </div>

          {/* Trip Details */}
          <div className="p-4 bg-white border border-green-500 rounded-xl shadow-md space-y-3">
            <h2 className="text-xl font-bold text-gray-800">Trip Details</h2>

            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <div className="flex-1 min-w-[80px] flex flex-col gap-1">
                <span className="uppercase font-semibold ">Trip Date</span>
                <span className="font-semibold text-gray-800">
                  {post.trip_date
                    ? new Date(post.trip_date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
              <div className="flex-1 min-w-[80px] flex flex-col gap-1">
                <span className="uppercase font-semibold">Duration</span>
                <span className="font-semibold text-gray-800">
                  {post.trip_duration ? `${post.trip_duration} Days` : "N/A"}
                </span>
              </div>
              <div className="flex-1 min-w-[80px] flex flex-col gap-1">
                <span className="uppercase font-semibold">Cost</span>
                <span className="font-semibold text-gray-800">
                  {post.trip_cost ? `$${post.trip_cost}` : "N/A"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-xs text-gray-500">
              <span className="uppercase font-semibold">Location</span>
              {post.location_description ? (
                <span className="text-gray-800">
                  {post.location_description}{" "}
                  {post.location_link && (
                    <a
                      href={post.location_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-4 py-2 bg-green-400 text-white font-medium rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition duration-300"
                    >
                      View Map
                    </a>
                  )}
                </span>
              ) : post.location_link ? (
                <a
                  href={post.location_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  View Map
                </a>
              ) : (
                <span className="font-semibold text-gray-800">N/A</span>
              )}
            </div>
          </div>
        </div>

        {/* --- COMMENTS --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-1">
            <h2 className="text-2xl font-bold text-[#002B11]">Comment</h2>
            <span className="bg-gray-100 px-3 py-0.5 rounded-full text-sm font-bold">
              {comments.length}
            </span>
          </div>

          {/* Add Comment */}
          <div className="relative group">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full border-2 border-gray-100 rounded-2xl p-4 pr-16 outline-none focus:border-[#008A3D] transition min-h-[10px] bg-gray-50 group-focus-within:bg-white resize-none"
            />
            <button
              onClick={handleAddComment}
              className="absolute bottom-4 right-4 bg-[#002B11] text-white p-2.5 rounded-xl hover:bg-[#008A3D] transition shadow-lg disabled:opacity-50"
              disabled={!newComment.trim()}
            >
              <Send size={20} />
            </button>
          </div>

          {/* Comment List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-400 text-center py-8 italic">
                No comments yet.
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-50 hover:border-gray-100 transition shadow-sm"
                >
                  <img
                    src={comment.user_id?.avatar || "/default-avatar.png"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-800">
                        {comment.user_id.username}
                      </h4>
                      <span className="text-[10px] text-gray-400">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {comment.content}
                    </p>
                    {currentUser && comment.user_id?._id === currentUser.id && (
                      <div className="relative">
                        <button onClick={() => setOpenMenuId(comment._id)}>
                          <MoreVertical size={16} />
                        </button>

                        {openMenuId === comment._id && (
                          <div className="absolute right-0 bg-white shadow-md rounded-md p-2">
                            <button className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100">
                              <Edit size={14} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="flex items-center gap-2 px-2 py-1 text-red-500 hover:bg-gray-100"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
