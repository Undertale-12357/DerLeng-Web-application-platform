// frontend/src/components/profile/TabContent.jsx
import StoryCard from "../stories/StoryCard.jsx";
import Spinner from "../Spinner.jsx";
import { Calendar, Users, DollarSign, CheckCircle, XCircle, Clock, MapPin } from "lucide-react";
import BookingModal from "./BookingModal.jsx";
import CommunityCard from "../CommunityCard.jsx";

export default function TabContent({
  activeTab,
  userOrders,
  loadingOrders,
  userPosts,
  loadingPosts,
  userBookings,
  loadingBookings,
  userFavorites ,
  loadingFavorites,
  navigateToDetail,
  handleLike,
  handleFavorite,
  selectedBooking,
  setSelectedBooking,
  setPreview,
  navigateToCommunityDetail,
  onEdit,
  onDelete,
}) {
  return (
    <div className="md:col-span-3 rounded-lg shadow-md p-3">
      <h2 className="text-xl font-bold text-[#002B11] mb-2">{activeTab}</h2>

      {/* My Posts */}
      {activeTab === "My Posts" && (
        <div>
          {loadingPosts ? (
            <Spinner />
          ) : userPosts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No posts yet! Start creating your first travel story.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {userPosts.map((post) => (
                <StoryCard
                  key={post._id || post.id}
                  post={post}
                  onClick={() => navigateToDetail(post._id || post.id)}
                  onLike={handleLike}
                  onFavorite={handleFavorite}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Photos */}
      {activeTab === "Photos" && (
        <div>
          {loadingPosts ? (
            <Spinner />
          ) : userPosts.length === 0 ||
            userPosts.flatMap((post) => post.images || []).length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No photos yet! Create a post with images.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {userPosts
                .flatMap((post) => post.images || [])
                .map((img, i) => (
                  <div
                    key={i}
                    className="relative group overflow-hidden rounded-lg"
                  >
                    <img
                      src={img}
                      alt={`photo-${i}`}
                      className="w-full h-52 object-cover rounded-lg hover:scale-105 transition"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/200?text=Photo+Not+Found")
                      }
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Favorite */}
      {activeTab === "Favorite" && (
        <div>
          {loadingFavorites ? (
            <Spinner />
          ) : userFavorites.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No favorite posts yet!
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {/* POSTS FAVORITES */}
              {userFavorites.posts.map((post) => (
                <StoryCard
                  key={post._id}
                  post={post}
                  onClick={() => navigateToDetail(post._id)}
                  onLike={(id) => handleLike(id, "Post")}
                  onFavorite={(id) => handleFavorite(id, "Post")}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}

              {/* COMMUNITY FAVORITES */}
              {userFavorites.communities.map((post) => (
                <CommunityCard
                  key={post._id}
                  post={post}
                  onClick={() => navigateToCommunityDetail(post._id)}
                  onLike={(id) => handleLike(id, "CommunityPost")}
                  onFavorite={(id) => handleFavorite(id, "CommunityPost")}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking History */}
      {activeTab === "Booking History" && (
        <div>
          {loadingBookings ? (
            <Spinner />
          ) : userBookings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No bookings yet!</p>
          ) : (
            <div className="space-y-4">
              {userBookings.map((b) => (
                <div
                  key={b._id}
                  className="border border-gray-200 p-5 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer bg-white"
                  onClick={() => setSelectedBooking(b)}
                >
                  <p className="text-xs text-gray-400 mb-1">
                    Booked on{" "}
                    {new Date(b.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={18} className="text-red-500" />
                    <h3 className="font-bold text-lg text-gray-800">
                      {b.community_post_id?.title}
                    </h3>
                  </div>
                  <div className="border-b border-gray-200 mb-3"></div>

                  <div className="flex items-center justify-between text-sm text-gray-700 mt-2">
                    {/* DATE */}
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-blue-400" />
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                        {new Date(b.booking_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {/* DIVIDER */}
                    <div className="h-5 w-px bg-gray-300"></div>

                    {/* PEOPLE */}
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-purple-400" />
                      <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">
                        {b.number_of_people} people
                      </span>
                    </div>

                    {/* DIVIDER */}
                    <div className="h-5 w-px bg-gray-300"></div>

                    {/* COST */}
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-green-400" />
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-md">
                        ${b.total_price}
                      </span>
                    </div>

                    {/* DIVIDER */}
                    <div className="h-5 w-px bg-gray-300"></div>

                    {/* STATUS */}
                    <div className="flex items-center gap-2">
                      {b.status === "approved" ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : b.status === "rejected" ? (
                        <XCircle size={16} className="text-red-500" />
                      ) : (
                        <Clock size={16} className="text-yellow-500" />
                      )}

                      <span
                        className={`font-semibold px-2 py-0.5 rounded-md ${
                          b.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : b.status === "rejected"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Order History" && (
        <div className="space-y-4">
          {loadingOrders ? (
            <Spinner />
          ) : !userOrders || userOrders.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No orders found.</p>
          ) : (
            userOrders.map((order) => {
              const isCompleted = ["delivered", "cancelled"].includes(
                order.status,
              );

              return (
                <div
                  key={order._id}
                  className={`flex justify-between items-center p-4 border rounded-xl mb-3 transition-all ${
                    isCompleted
                      ? "bg-gray-50 opacity-75"
                      : "bg-white border-green-200 shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">
                        Order #{order._id.slice(-6)}
                      </h3>
                      {!isCompleted && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-green-700 font-bold">
                      ${order.total_price}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingModal
          selectedBooking={selectedBooking}
          setSelectedBooking={setSelectedBooking}
          setPreview={setPreview}
        />
      )}
    </div>
  );
}