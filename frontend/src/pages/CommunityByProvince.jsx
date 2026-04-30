

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import communityService from "../services/community.service";
import CommunityCard from "../components/CommunityCard";
import useCommunityInteractions from "../hooks/useCommunityInteraction.js";
import { getProvinces } from "../services/place.service";
import { ArrowLeft } from "lucide-react";

export default function CommunityByProvince() {
  const { provinceId } = useParams();
  const navigate = useNavigate();

  // 1. STATE FIRST
  const [communities, setCommunities] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const limit = 10;
  const [provinceName, setProvinceName] = useState("");

  // 2. FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await communityService.getByProvince(
          provinceId,
          page,
          limit
        );

        setCommunities(res?.posts || []);
        setPagination(res?.pagination || null);
      } catch (err) {
        console.error(err);
        setCommunities([]);
      }
    };

    fetchData();
  }, [provinceId, page]);
  useEffect(() => {
    const fetchProvinceName = async () => {
      try {
        const res = await getProvinces();

        const found = res.find((p) => String(p._id) === String(provinceId));

        if (found) {
          setProvinceName(found.province_name);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProvinceName();
  }, [provinceId]);

  // 3. HOOK AFTER DATA EXISTS
  const {
    likedMap,
    likesMap,
    favoritesMap,
    handleLike,
    handleFavorite,
  } = useCommunityInteractions(communities);
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
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft size={22} />
        </button>

        <h1 className="text-2xl font-bold">
          Communities in {provinceName || "Province"}
        </h1>
      </div>

      {communities.length === 0 ? (
        <p>No communities found</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {communities.map((post) => (
              <CommunityCard
                key={post._id}
                post={{
                  ...post,
                  likes: likesMap[post._id] || 0,
                  liked: likedMap[post._id] || false,
                  favorited: favoritesMap[String(post._id)] || false,
                }}
                onClick={() => navigate(`/community/${post._id}`)}
                onLike={handleLike}
                onFavorite={handleFavorite}
              />
            ))}
          </div>

          {/* PAGINATION */}
          {/* <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span>
              Page {page} of {pagination?.pages || 1}
            </span>

            <button
              disabled={page >= (pagination?.pages || 1)}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div> */}
          <div className="flex items-center justify-center gap-2 mt-6">
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
                <span key={idx} className="px-2 text-gray-400">
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
              disabled={page >= (pagination?.pages || 1)}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}