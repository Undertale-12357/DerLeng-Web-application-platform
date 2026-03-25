//frontend\src\pages\Profile.jsx
import { useState, useContext, useEffect } from "react";
import { ChevronDown, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../components/EditProfile.jsx";
import ChangePasswordModal from "../components/ChangePassword.jsx";
import { AuthContext } from "../context/AuthContext";
import postService from "../services/post.service.js";
import userService from "../services/user.service.js";
import StoryCard from "../components/stories/StoryCard";
import Spinner from "../components/Spinner.jsx"; // Your spinner component

export default function Profile() {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const defaultUser = {
    username: "N/A",
    email: "N/A",
    bio: "No bio yet",
    location: "N/A",
    created_at: "N/A",
    website: "N/A",
  };
  const currentUser = { ...defaultUser, ...user };

  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [activeTab, setActiveTab] = useState("My Posts");
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // NEW: spinner states
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  // inside the component
  const creationDay = currentUser.created_at
    ? (() => {
        const d = new Date(currentUser.created_at);
        const month = d.toLocaleString("en-US", { month: "short" });
        const day = d.getDate();
        const year = d.getFullYear();
        return `${month} ${day} ${year}`;
      })()
    : "";


  const fetchUserPosts = async () => {
    if (!user?.id || !user?.token) return;

    setLoadingPosts(true);
    try {
      const posts = await postService.getPostsByUser(user.id, user.token);
      const postsWithLikes = await Promise.all(
        posts.map(async (post) => {
          const id = post._id || post.id;
          const likes = await postService.getLikesCount(id);
          return {
            ...post,
            _id: id,
            images: post.images || [],
            likes: likes || 0,
            liked: false,
          };
        })
      );
      setUserPosts(postsWithLikes);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchUserPosts();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigateToDetail = (postId) => navigate(`/posts/${postId}`);

  const handleLike = async (postId) => {
    const result = await postService.toggleLike(postId);
    setUserPosts((prev) =>
      prev.map((p) =>
        (p._id || p.id) === postId
          ? {
              ...p,
              liked: result.liked,
              likes: result.liked ? (p.likes || 0) + 1 : (p.likes || 0) - 1,
            }
          : p
      )
    );
  };

  const handleFavorite = (postId) => {
    setUserPosts((prev) =>
      prev.map((p) =>
        (p._id || p.id) === postId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  };

  // HANDLE AVATAR UPLOAD
  const handleEditAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", "avatar");

    const res = await userService.uploadProfileImage(formData, user.token);

    setUser((prev) => {
      const updated = { ...prev, avatar: res.data.avatar };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
    setIsUploadingAvatar(false);
  };

  // HANDLE COVER UPLOAD
  const handleEditCover = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingCover(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", "cover");

    const res = await userService.uploadProfileImage(formData, user.token);

    setUser((prev) => {
      const updated = { ...prev, cover: res.data.cover };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
    setIsUploadingCover(false);
  };

  if (!user)
    return (
      <p className="text-center mt-20 text-gray-500">Please login first!</p>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* COVER */}
      <div className="relative w-full h-[280px] border-1 border-gray-200">
        {isUploadingCover ? (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <Spinner />
    </div>
  ) : currentUser.cover ? (
    <img
      src={`${currentUser.cover}?t=${Date.now()}`}
      alt="cover"
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="text-gray-500 text-sm font-semibold text-center px-4 mt-30">
      No cover image yet. Click to upload a cover!
    </div>
  )}
        <label className="absolute top-4 right-6 bg-white p-2 rounded-full shadow-md cursor-pointer">
          <Camera size={18} className="text-gray-700" />
          <input type="file" hidden onChange={handleEditCover} />
        </label>

        {/* AVATAR */}
        <div className="absolute left-16 -bottom-12 ">
          <div className="relative">
            {isUploadingAvatar ? (
              <div className="w-28 h-28 flex items-center justify-center bg-gray-100 rounded-full  ">
                <Spinner />
              </div>
            ) : (
              <img
                src={currentUser.avatar ? `${currentUser.avatar}?t=${Date.now()}` : "upload"}
                alt="avatar"
                className="w-28 h-28 rounded-full border-4 border-gray-100 object-cover"
              />
            )}
            <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md cursor-pointer">
              <Camera size={16} className="text-gray-700" />
              <input type="file" hidden onChange={handleEditAvatar} />
            </label>
          </div>
        </div>
      </div>

      {/* USER INFO */}
      <div className="max-w-6xl mx-auto px-6 mt-10 sm:mt-12 md:mt-16 lg:mt-1">
        <h1 className="text-2xl font-bold">{currentUser.username}</h1>
        <div className="flex justify-start mt-2">
          <p className="text-gray-600 text-sm">
            Posts contributed: <span className="font-bold">{userPosts.length}</span> posts
          </p>
        </div>

        {/* TABS */}
        <div className="flex gap-8 mt-4 border-b border-gray-200 pb-2 text-sm font-semibold relative">
          {["My Posts", "Photos", "Favorite"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${
                activeTab === tab
                  ? "border-b-2 border-green-600 text-green-700"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}

          {/* SETTINGS DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
              className="flex items-center gap-2 pb-2 text-gray-600 hover:text-black"
            >
              Setting
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  showSettingsDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showSettingsDropdown && (
              <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <ul className="flex flex-col text-gray-700 text-sm">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setShowSettingsDropdown(false);
                    }}
                  >
                    Edit Profile
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setIsChangePasswordOpen(true);
                      setShowSettingsDropdown(false);
                    }}
                  >
                    Change Password
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 font-semibold"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
          {/* LEFT INTRO + PHOTO PREVIEW */}
          <div className="bg-white rounded-lg shadow-md p-5 h-fit">
            <h2 className="font-bold text-lg mb-4">Intro</h2>
            <p className="text-sm text-gray-600 mb-4">{currentUser.bio}</p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>📍 {currentUser.city}</li>
              <li>🗓 {creationDay}</li>
              <li>
  🔗{" "}
  {currentUser.website ? (
    <a
      href={
        currentUser.website.startsWith("http")
          ? currentUser.website
          : `https://${currentUser.website}`
      }
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline break-all"
    >
      {currentUser.website}
    </a>
  ) : (
    "N/A"
  )}
</li>
            </ul>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-sm">Photos</h3>
                <button
                  onClick={() => setActiveTab("Photos")}
                  className="text-xs text-gray-500 hover:underline cursor-pointer"
                >
                  View all
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {userPosts
                  .flatMap((post) => post.images || [])
                  .slice(0, 6)
                  .map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`preview-${i}`}
                      className="w-full h-16 object-cover rounded-md"
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* RIGHT TAB CONTENT */}
          <div className="md:col-span-3 rounded-lg shadow-md p-3">
            {/* My Posts Tab */}
            {activeTab === "My Posts" && (
              <div>
                {loadingPosts ? (
                  <Spinner></Spinner>
                ) : userPosts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No posts yet! Start creating your first travel story.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {userPosts.map((post) => (
                      <StoryCard
                        key={post._id || post.id}
                        post={post}
                        onClick={() => navigateToDetail(post._id || post.id)}
                        onLike={handleLike}
                        onFavorite={handleFavorite}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Photos Tab */}
            {activeTab === "Photos" && (
              <div>
                {loadingPosts ? (
                  <p className="text-gray-500 text-center py-8"><Spinner></Spinner></p>
                ) : userPosts.length === 0 || userPosts.flatMap((post) => post.images || []).length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No photos yet! Create a post with images.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {userPosts
                      .flatMap((post) => post.images || [])
                      .map((img, i) => (
                        <div key={i} className="relative group overflow-hidden rounded-lg">
                          <img
                            src={img}
                            alt={`photo-${i}`}
                            className="w-full h-52 object-cover rounded-lg hover:scale-105 transition"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/200?text=Photo+Not+Found";
                            }}
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Favorite Tab */}
            {activeTab === "Favorite" && (
              <div>
                <p className="text-gray-500 text-center py-8">No favorite posts yet!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={currentUser}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
}