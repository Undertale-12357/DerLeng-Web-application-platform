
import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EditProfileModal from "../components/EditProfile.jsx";
import ChangePasswordModal from "../components/ChangePassword.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

import postService from "../services/post.service.js";
import bookingService from "../services/booking.service.js";
import favoriteService from "../services/favorite.service.js";
import likeService from "../services/like.service.js";

import AvatarCover from "../components/profile/AvatarCover.jsx";
import PersonalInfo from "../components/profile/PersonalInfo.jsx";
import Tabs from "../components/profile/Tabs.jsx";
import TabContent from "../components/profile/TabContent.jsx";
import EditPostModal from "../components/EditPostModal";
import { deletePost } from "../services/post.service";
import { getMyOrders } from "../services/order.service.js";
import { socket } from "../utils/socket.js";
export default function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser, logout } = useContext(AuthContext);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const defaultUser = {
    username: "N/A",
    email: "N/A",
    bio: "No bio yet",
    location: "N/A",
    created_at: "N/A",
    website: "N/A",
  };
  const handleEdit = (post) => {
  setSelectedPost(post);
  setShowEditModal(true);
  };
  const handleDelete = async (postId) => {
  if (!window.confirm("Are you sure you want to delete this post?")) return;

  try {
    await postService.deletePost(postId);
    fetchUserPosts(); // 🔥 better than reload
  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
};
  const currentUser = { ...defaultUser, ...user };

  // ---------------- TAB ----------------
  const getTabFromURL = () => {
    const tab = new URLSearchParams(location.search).get("tab");
    if (tab === "booking") return "Booking History";
    if (tab === "favorites") return "Favorite";
    return "My Posts";
  };

  const [activeTab, setActiveTab] = useState(getTabFromURL());
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  useEffect(() => {
    setActiveTab(getTabFromURL());
  }, [location.search]);

  // ---------------- STATE ----------------
  const [userPosts, setUserPosts] = useState([]);
  const [userBookings, setUserBookings] = useState([]);

  const [userFavorites, setUserFavorites] = useState({
    posts: [],
    communities: [],
  });

  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  
  // ---------------- FETCH POSTS ----------------
  const fetchUserPosts = async () => {
    if (!user?.id || !user?.token) return;

    setLoadingPosts(true);

    try {
      const posts = await postService.getPostsByUser(user.id, user.token);

      const postIds = posts.map((p) => p._id);

      const [likesCounts, likedStatuses] = await Promise.all([
        Promise.all(postIds.map((id) => likeService.getLikesCount(id, "Post"))),
        Promise.all(postIds.map((id) => likeService.isLiked(id, "Post", user.token))),
      ]);

      const mapped = posts.map((post, i) => ({
        ...post,
        _id: post._id,
        images: post.images || [],
        likes: likesCounts[i]?.likes || 0,
        liked: likedStatuses[i]?.liked || false,
        favorited: false, // IMPORTANT: will be synced later
      }));

      setUserPosts(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchUserOrders = async () => {
    if (!user || !user.id) return;
    setLoadingOrders(true);
    try {
      const response = await getMyOrders(user.id);
      const orders = response.data?.data || response.data || [];
      setUserOrders(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // ---------------- FETCH BOOKINGS ----------------
  const fetchUserBookings = async () => {
    try {
      const res = await bookingService.getMyBookings();
      setUserBookings(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  // ---------------- FETCH FAVORITES ----------------
  const fetchUserFavorites = async () => {
    if (!user?.token) return;

    setLoadingFavorites(true);

    try {
      const favorites = await favoriteService.getFavorites(null, user.token);

      const posts = [];
      const communities = [];

      await Promise.all(
        favorites.map(async (fav) => {
          const target = fav.target_id;
          if (!target?._id) return;

          const likeRes = await likeService.getLikesCount(target._id, fav.target_type);
          const likedRes = await likeService.isLiked(target._id, fav.target_type, user.token);

          const formatted = {
            ...target,
            _id: target._id,
            images: target.images || [],
            likes: likeRes?.likes || 0,
            liked: likedRes?.liked || false,
            favorited: true,
          };

          if (fav.target_type === "Post") {
            posts.push(formatted);
          } else {
            communities.push(formatted);
          }
        })
      );

      setUserFavorites({ posts, communities });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFavorites(false);
    }
  };

  // ---------------- INIT ----------------
  useEffect(() => {
    if (user?.id) {
      fetchUserPosts();
      fetchUserBookings();
      fetchUserFavorites();
      fetchUserOrders();
    }
  }, [user]);

  // ---------------- SYNC FAVORITES INTO POSTS (🔥 IMPORTANT FIX) ----------------
  useEffect(() => {
    if (!userPosts.length) return;

    const favoriteSet = new Set([
      ...userFavorites.posts.map((p) => p._id),
      ...userFavorites.communities.map((p) => p._id),
    ]);

    setUserPosts((prev) =>
      prev.map((post) => ({
        ...post,
        favorited: favoriteSet.has(post._id),
      }))
    );
  }, [userFavorites]);

  useEffect(() => {
    if (!user?.id) return;

    socket.on("orderUpdate", (data) => {
      fetchUserOrders();
    });

    return () => socket.off("orderUpdate");
  }, [user?.id]);

  // ---------------- LIKE ----------------
  const toggleLikePost = async (postId, type = "Post") => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await likeService.toggleLike(postId, type, token);

    const update = (post) =>
      post._id === postId
        ? {
            ...post,
            liked: res.liked,
            likes: res.liked
              ? post.likes + 1
              : Math.max(0, post.likes - 1),
          }
        : post;

    setUserPosts((prev) => prev.map(update));

    setUserFavorites((prev) => ({
      posts: prev.posts.map(update),
      communities: prev.communities.map(update),
    }));
  };

  // ---------------- FAVORITE TOGGLE ----------------
  const toggleFavoritePost = async (postId, type = "Post") => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await favoriteService.toggleFavorite(postId, type, token);

    setUserPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? { ...post, favorited: res.isFavorite }
          : post
      )
    );

    setUserFavorites((prev) => {
      const update = (p) =>
        p._id === postId ? { ...p, favorited: res.isFavorite } : p;

      if (res.isFavorite) {
        const post = userPosts.find((p) => p._id === postId);
        if (!post) return prev;

        if (type === "Post") {
          return {
            posts: [...prev.posts, { ...post, favorited: true }],
            communities: prev.communities,
          };
        } else {
          return {
            posts: prev.posts,
            communities: [...prev.communities, { ...post, favorited: true }],
          };
        }
      }

      return {
        posts: prev.posts.filter((p) => p._id !== postId),
        communities: prev.communities.filter((p) => p._id !== postId),
      };
    });
  };

  // ---------------- NAV ----------------
  const navigateToDetail = (id) => navigate(`/posts/${id}`);
  const navigateToCommunityDetail = (id) => navigate(`/community/${id}`);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ---------------- UI ----------------
  if (!user)
    return (
      <p className="text-center mt-20 text-gray-500">
        Please login first!
      </p>
    );

  return (
    <div className="min-h-screen bg-white">
      <AvatarCover user={currentUser} setUser={setUser} />

      <div className="max-w-6xl mx-auto px-6 mt-10 sm:mt-12 md:mt-16 lg:mt-1">
        <h1 className="text-2xl text-[#002B11] font-bold">{currentUser.username}</h1>

         <div className="flex justify-start mt-2">
           <p className="text-gray-600 text-sm">
             Posts contributed: <span className="font-bold">{userPosts.length}</span> posts
           </p>
         </div>
<Tabs
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  showSettingsDropdown={showSettingsDropdown}
  setShowSettingsDropdown={setShowSettingsDropdown}
  handleLogout={handleLogout}
  setIsEditModalOpen={setIsEditModalOpen}
  setIsChangePasswordOpen={setIsChangePasswordOpen}
/>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
          <PersonalInfo
            currentUser={currentUser}
            userPosts={userPosts}
          />

          <TabContent
            activeTab={activeTab}
            userPosts={userPosts}
            userFavorites={userFavorites}
            loadingPosts={loadingPosts}
            loadingFavorites={loadingFavorites}
            userBookings={userBookings}
            userOrders={userOrders}
            loadingOrders={loadingOrders}
            navigateToDetail={navigateToDetail}
            navigateToCommunityDetail={navigateToCommunityDetail} 
            handleLike={toggleLikePost}
            handleFavorite={toggleFavoritePost}
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
            onEdit={handleEdit}
            onDelete={handleDelete}



          />
        </div>
        
      </div>
      {showEditModal && (
  <EditPostModal
    post={selectedPost}
    onClose={() => setShowEditModal(false)}
    onUpdated={() => {
      setShowEditModal(false);
      fetchUserPosts(); // 🔥 better than reload
    }}
  />
)}

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