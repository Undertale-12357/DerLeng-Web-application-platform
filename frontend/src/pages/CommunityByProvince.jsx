import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import communityService from "../services/community.service";
import CommunityCard from "../components/CommunityCard";

export default function CommunityByProvince() {
  const { provinceId } = useParams();
  const navigate = useNavigate();

  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await communityService.getAllCommunityPosts();

        // filter by province
        const filtered = data.filter((c) => c.province_id?._id === provinceId);

        setCommunities(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [provinceId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Communities</h1>

      {communities.length === 0 ? (
        <p>No communities found</p>
      ) : (
        <div className="p-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {communities.map((post) => (
            <CommunityCard
              key={post._id}
              post={post}
              onClick={() => navigate(`/community/${post._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
