import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getUserNotifications } from "../services/notification.service";
<<<<<<< HEAD
import BookingModal from "./profile/BookingModal";
=======
import { getMyOrders } from "../services/order.service";
>>>>>>> ca94ed874f71f20008a08cfa2766aae2261990eb

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");

<<<<<<< HEAD
export default function NotificationPanel({
  isOpen,
  onClose,
  user,
  notifications,
  setNotifications,
}) {
  // const [notifications, setNotifications] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
=======
export default function NotificationPanel({ isOpen, onClose, user }) {
  const [notifications, setNotifications] = useState([]);
  const [orderTracking, setOrderTracking] = useState([]);
  const [activeTab, setActiveTab] = useState("Community");
>>>>>>> ca94ed874f71f20008a08cfa2766aae2261990eb
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
    if (isOpen && user?.id && activeTab === "Orders") {
      getMyOrders(user.id).then((res) => {
        const active = res.data.data.filter((o) =>
          ["pending", "processing", "shipped","delivered"].includes(o.status),
        );
        setOrderTracking(
          active.map((o) => ({
            orderId: o._id,
            status: o.status,
            message: `Your order is currently ${o.status}`,
          })),
        );
      });
    }

    if (user?.id) {
      socket.emit("register", user.id);

      socket.on("orderUpdate", (data) => {
        setOrderTracking((prev) => {
          const exists = prev.find((o) => o.orderId === data.orderId);
          if (exists) {
            return prev.map((o) =>
              o.orderId === data.orderId ? { ...o, ...data } : o,
            );
          }

          return [data, ...prev];
        });
      });
    }

    return () => socket.off("orderUpdate");
  }, [isOpen, activeTab, user]);

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

  const handleConfirmReceived = (orderId) => {
    setOrderTracking((prev) => prev.filter((o) => o.orderId !== orderId));

    // Task: call a backend API here to save the "User Confirmed At" timestamp in your database.
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
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("Community")}
            className={`font-bold ${activeTab === "Community" ? "border-b-2 border-green-700" : "text-gray-400"}`}
          >
            Community
          </button>
          <button
            onClick={() => setActiveTab("Orders")}
            className={`font-bold ${activeTab === "Orders" ? "border-b-2 border-green-700" : "text-gray-400"}`}
          >
            Track Order
          </button>
        </div>
        <button onClick={onClose}>✕</button>
      </div>

      {/* List */}
      <div className="p-4 overflow-y-auto h-full">
        {!user ? (
          <p className="text-center text-gray-500 mt-10">
            Please login to track orders.
          </p>
        ) : activeTab === "Orders" ? (
          orderTracking.length === 0 ? (
            <p className="text-center mt-10">No active orders.</p>
          ) : (
            orderTracking.map((order) => (
              <div
                key={order.orderId}
                className="p-4 border rounded-lg mb-3 bg-gray-50 shadow-sm"
              >
                <p className="font-bold">Order #{order.orderId.slice(-6)}</p>
                <p className="text-sm text-gray-600">{order.message}</p>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-500 animate-pulse"
                          : "bg-yellow-500"
                      }`}
                    ></span>
                    <span className="text-xs font-bold uppercase">
                      {order.status}
                    </span>
                  </div>

                  {/* Only show this button if status is delivered */}
                  {order.status === "delivered" && (
                    <button
                      onClick={() => handleConfirmReceived(order.orderId)}
                      className="bg-[#002B11] text-white text-xs px-3 py-1.5 rounded-md hover:bg-green-800 transition font-semibold"
                    >
                      Confirm Received
                    </button>
                  )}
                </div>
              </div>
            ))
          )
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
