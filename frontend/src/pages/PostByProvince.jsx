import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import StoryCard from "../components/stories/StoryCard";
import postService from "../services/post.service";
import { getProvinces } from "../services/place.service";
import { ArrowLeft } from "lucide-react";

export default function PostByProvince() {
  const { provinceId } = useParams();
  const navigate = useNavigate();
  const [provinceName, setProvinceName] = useState("");

  // STATE
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const limit = 10;

 
  // FETCH POSTS
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await postService.getPostsByProvince(
          provinceId,
          page,
          limit,
        );

        // ✅ IMPORTANT (your backend returns { data, pagination })
        setPosts(res?.data || []);
        setPagination(res?.pagination || null);
      } catch (err) {
        console.error("Fetch posts error:", err);
        setPosts([]);
      }
    };

    fetchPosts();
  }, [provinceId, page]);

  useEffect(() => {
    const fetchProvinceName = async () => {
      try {
        const res = await getProvinces();

        console.log("Provinces:", res); // debug
        console.log("ProvinceId:", provinceId);

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

  // PAGINATION (GitHub style)
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

  const totalPages = pagination?.totalPages || 1;
  const pages = getPagination(page, totalPages);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft size={22} />
        </button>

        <h1 className="text-2xl font-bold ">
          Travel Stories in {provinceName} Province
        </h1>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-400">No posts found</p>
      ) : (
        <>
          {/* POSTS GRID */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {posts.map((post) => (
              <StoryCard
                key={post._id}
                post={post}
                onClick={() => navigate(`/posts/${post._id}`)}
              />
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {/* PREV */}
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-40"
            >
              Prev
            </button>

            {/* PAGE NUMBERS */}
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

            {/* NEXT */}
            <button
              disabled={page >= totalPages}
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
