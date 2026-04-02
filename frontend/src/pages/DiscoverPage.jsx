import { useDiscover } from "../hooks/useDiscover";
import { provinceImages } from "../data/imageMap";
import { normalize } from "../utils/normalize";
import discoverBanner from "../assets/discover.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import communityService from "../services/community.service";
import CommunityCard from "../components/CommunityCard";
import likeService from "../services/like.service";
import favoriteService from "../services/favorite.service";

export default function DiscoverPage() {
  const { provinces, loading } = useDiscover();

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  const [communities, setCommunities] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [pagination, setPagination] = useState(null);
  const limit = 10;

  const [likedMap, setLikedMap] = useState({});
  const [likesMap, setLikesMap] = useState({});
  const [favoritesMap, setFavoritesMap] = useState({});

  // CHANGE PAGE
  const changePage = (newPage) => {
    setSearchParams({ page: newPage });
  };

  // FETCH COMMUNITIES
  useEffect(() => {
    const fetchCommunityPosts = async () => {
      try {
        setLoadingPosts(true);

        const res = await communityService.getAllCommunityPosts(page, limit);

        const posts =
          res?.posts ||
          res?.data?.posts ||
          res?.data ||
          res ||
          [];

        setCommunities(Array.isArray(posts) ? posts : []);
        setPagination(res?.pagination || res?.data?.pagination || null);
      } catch (err) {
        console.error("Fetch community error:", err);
        setCommunities([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchCommunityPosts();
  }, [page]);

  // FETCH LIKES + FAVORITES
  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const likesData = {};
        const likedData = {};
        const favoritesData = {};

        const token = localStorage.getItem("token");

        await Promise.all(
          (communities || []).map(async (post) => {
            try {
              const likeRes = await likeService.getLikesCount(
                post._id,
                "CommunityPost"
              );

              likesData[post._id] = likeRes?.likes || 0;

              if (token) {
                const likedRes = await likeService.isLiked(
                  post._id,
                  "CommunityPost",
                  token
                );

                likedData[post._id] = likedRes?.liked || false;
              }
            } catch (err) {
              console.log(err);
            }
          })
        );

        if (token) {
          const favorites = await favoriteService.getFavorites(
            "CommunityPost",
            token
          );

          (favorites || []).forEach((fav) => {
            const id =
              typeof fav.target_id === "object"
                ? fav.target_id?._id
                : fav.target_id;

            if (id) favoritesData[String(id)] = true;
          });
        }

        setLikesMap(likesData);
        setLikedMap(likedData);
        setFavoritesMap(favoritesData);
      } catch (err) {
        console.error(err);
      }
    };

    if (communities.length > 0) {
      fetchInteractions();
    }
  }, [communities]);

  // LIKE
  const handleLike = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login first");

    const res = await likeService.toggleLike(
      postId,
      "CommunityPost",
      token
    );

    setLikedMap((prev) => ({
      ...prev,
      [postId]: res.liked,
    }));

    setLikesMap((prev) => ({
      ...prev,
      [postId]: res.liked
        ? (prev[postId] || 0) + 1
        : Math.max((prev[postId] || 1) - 1, 0),
    }));
  };

  // FAVORITE
  const handleFavorite = async (postId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login first");

    const res = await favoriteService.toggleFavorite(
      postId,
      "CommunityPost",
      token
    );

    setFavoritesMap((prev) => ({
      ...prev,
      [String(postId)]: res.isFavorite,
    }));
  };

  // FILTER
  const filteredCommunities = (communities || []).filter((post) => {
    const keyword = search.toLowerCase();

    return (
      post?.title?.toLowerCase().includes(keyword) ||
      post?.content?.toLowerCase().includes(keyword) ||
      post?.province_id?.province_name?.toLowerCase().includes(keyword)
    );
  });

  // ✅ GITHUB STYLE PAGINATION
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

  const pages = getPagination(page, pagination?.pages || 1);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="relative w-full h-[250px]">
        <img
          src={discoverBanner}
          alt="Discover"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">
            Explore places with Derleng
          </h1>
        </div>
      </section>

      {/* SEARCH */}
      <section className="px-6 py-6 bg-white">
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search Community Tourism..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-5 py-2"
          />
        </div>
      </section>

      {/* PROVINCES */}
      <section className="px-3 py-2 bg-white">
        <h2 className="text-2xl font-bold mb-6">Explore by Province</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex space-x-4 overflow-x-auto">
            {provinces.map((prov) => {
              const key = normalize(prov.province_name);

              return (
                <div
                  key={prov._id}
                  onClick={() =>
                    navigate(`/community/province/${prov._id}`)
                  }
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

      {/* COMMUNITY */}
      <section className="px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Community Tourism</h2>

        {loadingPosts ? (
          <p>Loading posts...</p>
        ) : filteredCommunities.length === 0 ? (
          <p className="text-gray-400">No community posts yet.</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {filteredCommunities.map((post) => (
                <CommunityCard
                  key={post._id}
                  post={{
                    ...post,
                    likes: likesMap[post._id] || 0,
                    liked: likedMap[post._id] || false,
                    favorited: favoritesMap[String(post._id)] || false,
                  }}
                  onClick={() =>
  navigate(`/community/${post._id}`, {
    state: { page }
  })
}
                  onLike={handleLike}
                  onFavorite={handleFavorite}
                />
              ))}
            </div>

            {/* PAGINATION (GITHUB STYLE) */}
            <div className="flex items-center justify-center gap-2 mt-6">

              {/* Prev */}
              <button
                disabled={page === 1}
                onClick={() => changePage(page - 1)}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-40"
              >
                Prev
              </button>

              {/* Pages */}
              {pages.map((p, idx) =>
                p === "..." ? (
                  <span key={idx} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={idx}
                    onClick={() => changePage(p)}
                    className={`px-3 py-1 rounded ${
                      page === p
                        ? "bg-green-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              {/* Next */}
              <button
                disabled={page >= (pagination?.pages || 1)}
                onClick={() => changePage(page + 1)}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-40"
              >
                Next
              </button>

            </div>
          </>
        )}
      </section>
    </div>
  );
}