import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import postService from "../../services/post.service";
import { getProvinces } from "../../services/place.service";
import StoryCard from "../stories/StoryCard";

export default function InterestPanel2() {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [provinceId, setProvinceId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const res = await getProvinces();

        const phnomPenh = res.find((p) => p.province_name === "Phnom Penh");

        if (phnomPenh) {
          setProvinceId(phnomPenh._id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProvince();
  }, []);

  
  useEffect(() => {
    if (!provinceId) return;

    const fetchPosts = async () => {
      try {
        const res = await postService.getPostsByProvince(provinceId, 1, 10);

        setPosts(res?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [provinceId]);

  // 3️⃣ SCROLL FUNCTION
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full bg-white py-8 px-6">
      <div className="max-w-7xl mx-auto">


        {!loading && (
          <div className="flex items-center gap-4">
            {/* LEFT BUTTON */}
            <button
              onClick={() => scroll("left")}
              className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full"
            >
              <svg
                className="w-6 h-6 text-[#002B11]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* SCROLLABLE */}
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto scrollbar-hide flex-1"
            >
              <div className="flex gap-4">
                {posts.map((post) => (
                  <div key={post._id} className="w-[280px] flex-shrink-0">
                    <StoryCard
                      post={post}
                      onClick={() => navigate(`/posts/${post._id}`)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT BUTTON */}
            <button
              onClick={() => scroll("right")}
              className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full"
            >
              <svg
                className="w-6 h-6 text-[#002B11]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* HIDE SCROLLBAR */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
