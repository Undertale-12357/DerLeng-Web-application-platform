
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../services/place.service";
import { categoryImages } from "../../data/imageMap";

export default function InterestPanel() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getCategories();
      setCategories(data || []);
    };

    load();
  }, []);

  const normalizeKey = (name = "") =>
    name.toLowerCase().replace(/\s/g, "");

  const getCategoryImage = (name) => {
    const key = normalizeKey(name);
    return categoryImages[key] || "https://via.placeholder.com/300";
  };

  return (
  <div className="w-full bg-white py-8">

    <div className="mx-auto max-w-7xl px-1">
      <h2 className="text-2xl font-bold mb-6">
        Explore by Interest
      </h2>

      <div className="relative">
        {/* scroll container */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() =>
                navigate(`/posts/category/${cat._id}`)
              }
              className="min-w-[280px] h-[240px] relative rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition flex-shrink-0"
            >
              {/* image */}
              <img
                src={getCategoryImage(cat.category_name)}
                className="w-full h-full object-cover"
              />

              {/* overlay */}
              <div className="absolute inset-0  flex items-end p-3">
                <h3 className="text-white font-bold">
                  {cat.category_name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
}