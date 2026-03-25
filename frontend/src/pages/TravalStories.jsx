// //frontend\src\pages\TravalStories.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import useTravelStories from "../hooks/useTravelStories";
// import StoryCard from "../components/stories/StoryCard";
// import FeaturedStories from "../components/stories/FeaturedStories";
// import { Search } from "lucide-react";
// import Spinner from "../components/Spinner";

// export default function TravelStories() {
//   const { posts, loading, toggleLikePost } = useTravelStories();
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const postsPerPage = 10; // adjust as needed
//   const navigate = useNavigate();

//   // Restore page + scroll on mount
//   useEffect(() => {
//     const savedPage = sessionStorage.getItem("travelStoriesPage");
//     if (savedPage) {
//       setCurrentPage(parseInt(savedPage, 10));
//       sessionStorage.removeItem("travelStoriesPage");
//     }

//     const savedScroll = sessionStorage.getItem("travelStoriesScroll");
//     if (savedScroll) {
//       setTimeout(() => {
//         window.scrollTo(0, parseInt(savedScroll, 10));
//         sessionStorage.removeItem("travelStoriesScroll");
//       }, 50);
//     }
//   }, []);

//   const filteredPosts = posts.filter((p) =>
//     p.title.toLowerCase().includes(search.toLowerCase())
//   );

//   // Pagination calculation
//   const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
//   const startIndex = (currentPage - 1) * postsPerPage;
//   const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

//   const handlePostClick = (postId) => {
//     // Save current page + scroll before navigating
//     sessionStorage.setItem("travelStoriesPage", currentPage);
//     sessionStorage.setItem("travelStoriesScroll", window.scrollY);
//     navigate(`/posts/${postId}`);
//   };

//   if (loading)
//     return (
//       <div className="flex flex-col justify-center items-center min-h-screen bg-white">
//         <Spinner></Spinner>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-white">
//       <FeaturedStories posts={posts} />

//       <section className="px-8 py-4 max-w-[1600px] mx-auto sticky top-0 bg-white z-50 shadow-sm">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-[#002B11]">Travel Stories</h1>
//             <p className="text-gray-500">Discover experiences from our community</p>
//           </div>

//           <div className="flex space-x-4 items-center w-full md:w-auto">
//             <div className="relative flex-1 md:w-64">
//               <input
//                 type="text"
//                 placeholder="Search stories..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full border border-gray-200 py-2 pl-10 pr-3 outline-none focus:border-[#008A3D] rounded-sm transition-colors"
//               />
//               <Search
//                 size={16}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Posts Grid */}
//       <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
//         {currentPosts.map((post) => (
//           <StoryCard
//             key={post._id}
//             post={post}
//             onLike={toggleLikePost}
//             onClick={() => handlePostClick(post._id)}
//           />
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center mt-8 gap-2">
//         {Array.from({ length: totalPages }, (_, i) => (
//           <button
//             key={i + 1}
//             className={`px-3 py-1 rounded-md ${
//               currentPage === i + 1 ? "bg-green-500 text-white" : "bg-gray-100"
//             }`}
//             onClick={() => setCurrentPage(i + 1)}
//           >
//             {i + 1}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
//frontend\src\pages\TravalStories.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTravelStories from "../hooks/useTravelStories";
import StoryCard from "../components/stories/StoryCard";
import FeaturedStories from "../components/stories/FeaturedStories";
import { Search } from "lucide-react";
import Spinner from "../components/Spinner";


export default function TravelStories() {
  const { posts, loading, toggleLikePost, fetchPosts, totalPages, toggleFavoritePost } = useTravelStories();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  // Fetch posts when page changes
  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  // Restore page + scroll on mount
  useEffect(() => {
    const savedPage = sessionStorage.getItem("travelStoriesPage");
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
      sessionStorage.removeItem("travelStoriesPage");
    }

    const savedScroll = sessionStorage.getItem("travelStoriesScroll");
    if (savedScroll) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScroll, 10));
        sessionStorage.removeItem("travelStoriesScroll");
      }, 50);
    }
  }, []);

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handlePostClick = (postId) => {
    // Save current page + scroll before navigating
    sessionStorage.setItem("travelStoriesPage", currentPage);
    sessionStorage.setItem("travelStoriesScroll", window.scrollY);
    navigate(`/posts/${postId}`);
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
        <Spinner></Spinner>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <FeaturedStories posts={posts} />

      <section className="px-8 py-4 max-w-[1600px] mx-auto sticky top-0 bg-white z-50 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#002B11]">Travel Stories</h1>
            <p className="text-gray-500">Discover experiences from our community</p>
          </div>

          <div className="flex space-x-4 items-center w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search stories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 py-2 pl-10 pr-3 outline-none focus:border-[#008A3D] rounded-sm transition-colors"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {filteredPosts.map((post) => (
          <StoryCard
            key={post._id}
            post={post}
            onLike={toggleLikePost}
            onFavorite={toggleFavoritePost}
            onClick={() => handlePostClick(post._id)}
          />
        ))}
      </div>
      
      {/* EMPTY */}
      {filteredPosts.length === 0 && (
        <p className="text-center text-gray-400 pb-10">
          No posts found.
        </p>
      )}

      {/* Pagination */}
      <div className="flex justify-center pb-10 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === i + 1
                ? "bg-[#008A3D] text-white"
                : "bg-gray-100"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}