import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getUserNotifications } from "../services/notification.service";
import BookingModal from "./profile/BookingModal";

const socket = io("http://localhost:5000");

export default function NotificationPanel({
  isOpen,
  onClose,
  user,
  notifications,
  setNotifications,
}) {
  // const [notifications, setNotifications] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  console.log("USER FULL:", user);

  // Load from backend using axios instance
  useEffect(() => {
    if (!user) return;

    getUserNotifications()
      .then((data) => {
        setNotifications(data.data || []);
      })
      .catch(console.error);
  }, [user]);

  useEffect(() => {
    if (!user || !user.id) return;

    const userId = user.id;

    // ✅ REGISTER USER
    socket.emit("register", userId);
    console.log("📤 REGISTER SENT:", userId);

    // ✅ RECEIVE NOTIFICATION
    socket.on("notification", (data) => {
      console.log("📥 RECEIVED:", data);

      // 🔥 REMOVE notification
      if (data.type === "REMOVE_NOTIFICATION") {
        setNotifications((prev) =>
          prev.filter((n) => n.booking_id !== data.booking_id),
        );
        return;
      }

      // normal notification
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, [user]);
  const handleOpenBooking = (notification) => {
    const booking = notification.booking_id;

    if (!booking) {
      console.warn("No booking found in notification");
      return;
    }

    console.log("OPEN BOOKING:", booking); // debug

    setSelectedBooking(booking);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white text-black shadow-lg z-50
      transform transition-transform duration-300
      ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      style={{ width: "30%" }}
    >
      {/* Header */}
      <div className="p-5 flex justify-between items-center border-b">
        <h2 className="text-lg font-bold border-b border-gray-400 pb-1">
          Notifications
        </h2>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-black text-xl"
        >
          ✕
        </button>
      </div>

      {/* List */}
      <div className="p-4 space-y-4 overflow-y-auto h-full">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            No notifications yet
          </p>
        ) : (
          notifications.map((item) => (
            <div
              key={item._id}
              onClick={() => handleOpenBooking(item)}
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              <p className="font-semibold text-[#002B11]">{item.title}</p>

              <p className="text-sm text-gray-700 whitespace-pre-line">
                {item.message}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
      <BookingModal
        selectedBooking={selectedBooking}
        setSelectedBooking={setSelectedBooking}
      />
    </div>
  );
}
