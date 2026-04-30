import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import angkor from "../../assets/interestPanel/interest5/angkor.jpg";
import bokor from "../../assets/interestPanel/interest5/bokor.jpg";
import kohRong from "../../assets/interestPanel/interest5/koh-rong.jpg";
import tonleSab from "../../assets/interestPanel/interest5/tonle-sab.jpg";
import angkorView from "../../assets/interestPanel/interest5/Angkorview.jpg";
import bokorView from "../../assets/interestPanel/interest5/bokorview.jpg";
import tonleSabAlt from "../../assets/interestPanel/interest5/tonlesab.jpg";
import kohRongAlt from "../../assets/interestPanel/interest5/kohrong.jpg";

export default function InterestPanel5() {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const interests = [
    { id: 1, title: "Angkor Wat", image: angkor },
    { id: 2, title: "Bokor National Park", image: bokor },
    { id: 3, title: "Koh Rong Island", image: kohRong },
    { id: 4, title: "Tonlé Sap Lake", image: tonleSab },
    { id: 5, title: "Angkor Temple View", image: angkorView },
    { id: 6, title: "Bokor View", image: bokorView },
    { id: 7, title: "Koh Rong Adventure", image: kohRongAlt },
    { id: 8, title: "Tonlé Sab Wildlife", image: tonleSabAlt },
  ];

  // Create infinite loop by repeating interests 3 times
  const baseInterests = interests;
  const allInterests = [...baseInterests, ...baseInterests, ...baseInterests];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const itemWidth = 240 + 16; // card width + gap
      container.scrollLeft = itemWidth * 8;
    }
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const container = scrollContainerRef.current;
      const itemWidth = 240 + 16;

      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      // Reset scroll position for infinite loop
      setTimeout(() => {
        if (container.scrollLeft >= itemWidth * 16) {
          container.scrollLeft = itemWidth * 8;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft = itemWidth * 8;
        }
      }, 600);
    }
  };

  const handleCardClick = (title) => {
    navigate(`/TravelStories`);
  };

  return (
    <div className="w-full bg-white py-8 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Scroll Controls */}
        <div className="flex items-center gap-4">
          {/* Left Button */}
          <button
            onClick={() => scroll("left")}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6 text-[#002B11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Scrollable Container */}
          <div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide flex-1">
            <div className="flex gap-4">
              {allInterests.map((interest, index) => (
                <div
                  key={index}
                  onClick={() => handleCardClick(interest.title)}
                  className="flex-shrink-0 w-[240px] h-[240px] cursor-pointer group"
                >
                  {/* Image Card */}
                  <div className="relative w-full h-full rounded-lg overflow-hidden hover:opacity-90 transition-opacity">
                    <img
                      src={interest.image}
                      alt={interest.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Gradient Overlay - Bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 via-black/60 to-transparent flex items-center px-4">
                      <h3 className="text-white text-lg font-extrabold tracking-wide">
                        {interest.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Button */}
          <button
            onClick={() => scroll("right")}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6 text-[#002B11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hide scrollbar styles */}
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