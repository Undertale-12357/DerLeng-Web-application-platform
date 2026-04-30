import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { CircleUser, Bell, MessageCircleQuestionMark, ShoppingCart } from "lucide-react";
import AuthModals from "./AuthModals";
import NotificationPanel from "./NotificationPanel";
import LanguageDropdown from "./dropdowns/LanguageDropdown";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const { user } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleUserClick = () => {
    if (user) navigate("/profile");
    else setIsLoginOpen(true);
  };

  // Count total items
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCartClick = () => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    if (location.pathname === "/cart") {
      navigate(-1); // Go back if already on cart
    } else {
      navigate("/cart"); // Go to cart if anywhere else
    }
  };


  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-baseline gap-1">
              <img src={logo} alt="Derleng" className="h-10 sm:h-9 w-auto" />
              <span
                className="text-xl sm:text-2xl font-bold tracking-tight -ml-1"
                style={{
                  color: "#002B11",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  lineHeight: "1",
                }}
              >
                ERLENG
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
              <Link
                to="/discover"
                className="hover:text-[#002B11] hover:scale-110 transition"
              >
                Discover
              </Link>
              <Link
                to="/post"
                className="hover:text-[#002B11] hover:scale-110 transition"
              >
                Post
              </Link>
              <Link
                to="/TravelStories"
                className="hover:text-[#002B11] hover:scale-110 transition"
              >
                Stories
              </Link>
              <Link
                to="/about"
                className="hover:text-[#002B11] hover:scale-110 transition"
              >
                About
              </Link>
              <Link
                to="/shop"
                className="hover:text-[#002B11] hover:scale-110 transition"
              >
                Shop
              </Link>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <LanguageDropdown />

              {/* 🛒 CART ICON */}
              <button
                onClick={handleCartClick}
                className="relative p-1 rounded-full hover:bg-gray-100 transition"
              >
                <ShoppingCart className="w-6 h-6 text-[#002B11]" />

                {user && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(true)}
                className="p-1 rounded-full hover:bg-gray-100 transition relative"
              >
                <Bell className="w-6 h-6 text-[#002B11]" />

                {/* Only show red dot if notifications exist */}
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              <button
                className="p-1 rounded-full hover:bg-gray-100 transition"
                onClick={() => navigate("/faq")}
              >
                <MessageCircleQuestionMark className="w-6 h-6 text-[#002B11]" />
              </button>

              <button
                className="p-1 rounded-full hover:bg-gray-100 transition"
                onClick={handleUserClick}
              >
                <CircleUser className="w-6 h-6 text-[#002B11]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AuthModals isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      {/* Mobile Slide Menu */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu */}
          <div className="fixed top-0 right-0 h-full w-72 bg-white/90 backdrop-blur-xl shadow-2xl z-50 p-6 flex flex-col transform transition-transform duration-300 translate-x-0">
            {/* Close */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#002B11]">Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl hover:bg-green-100 transition active:scale-95"
              >
                <X className="w-6 h-6 text-[#002B11]" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col gap-2 text-[#002B11]">
              <Link
                to="/discover"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl hover:bg-green-100 transition font-medium"
              >
                Discover
              </Link>

              <Link
                to="/post"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl hover:bg-green-100 transition font-medium"
              >
                Post
              </Link>

              <Link
                to="/TravelStories"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl hover:bg-green-100 transition font-medium"
              >
                Stories
              </Link>

              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl hover:bg-green-100 transition font-medium"
              >
                Shop
              </Link>

              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl hover:bg-green-100 transition font-medium"
              >
                About
              </Link>
            </nav>

            {/* Bottom section (optional) */}
            <div className="mt-auto pt-6 border-t border-green-100 text-sm text-gray-400">
              © 2026 DERLENG
            </div>
          </div>
        </>
      )}

      <AuthModals isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        user={user}
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </>
  );
}
