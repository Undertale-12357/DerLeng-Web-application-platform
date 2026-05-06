import React, { useContext, useEffect, useState } from "react"; 
import { AuthContext} from "../context/AuthContext"
import { CartContext } from "../context/CartContext";
import { placeOrder } from "../services/order.service";
import { useNavigate } from "react-router-dom";
import qrImage from "../assets/QR.jpg"

export default function Cart() {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0,
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCheckout = async () => {
    const userId = user?.id || user?._id;
    if (!userId) {
      alert("User session not found. Please log in again.");
      return;
    }

    if (!address || !phone || !screenshot) {
      alert("Please fill in all fields and upload your payment screenshot.");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    formData.append("user", userId);

    const formattedItems = cartItems.map((item) => ({
      product: item._id, 
      quantity: item.quantity,
      price: item.price || item.minPrice,
    }));

    formData.append("items", JSON.stringify(formattedItems));
    formData.append("total_price", totalPrice);
    formData.append("shipping_address", address);
    formData.append("phone_number", phone);
    formData.append("transaction_image", screenshot);

    try {
      // Add this right before "const response = await placeOrder..."
      for (let [key, value] of formData.entries()) {
        console.log(`Sending Field -> ${key}:`, value);
      }
      const response = await placeOrder(formData, user.token);
      if (/*{response.data.success}*/ response.data) {
        setShowSuccess(true);
        clearCart();
      }
    } catch (error) {
      console.error("Order Error", error.response?.data)
      alert(error.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !showSuccess) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate("/shop")}
          className="text-green-600 underline"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-green-600 mb-4 transition"
      >
        ← Back
      </button>
      <h1 className="text-4xl font-bold text-[#002B11] mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT: Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl"
              />

              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <p className="text-green-600 font-semibold">${item.price}</p>
              </div>

              {/* QUANTITY CONTROLS */}
              <div className="flex items-center gap-3 bg-gray-100 px-3 py-1 rounded-full">
                <button
                  onClick={() => updateQuantity(item._id, -1)}
                  className="w-8 h-8 flex items-center justify-center font-bold hover:text-green-600"
                >
                  -
                </button>
                <span className="font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, 1)}
                  className="w-8 h-8 flex items-center justify-center font-bold hover:text-green-600"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* RIGHT: PAYMENT FORM */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border-t-4 border-green-600 h-fit">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Phone Number"
              className="w-full p-3 bg-gray-50 rounded-xl border focus:outline-green-500"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) setPhone(value);
              }}
            />
            <textarea
              placeholder="Delivery Address"
              className="w-full p-3 bg-gray-50 rounded-xl border focus:outline-green-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="mb-6 p-4 bg-white rounded-2xl border border-dashed border-gray-300 text-center">
            <p className="text-xs font-bold text-gray-500 mb-3">
              SCAN TO PAY (${totalPrice})
            </p>
            <img
              src={qrImage}
              alt="QR"
              className="w-32 mx-auto mb-4 rounded-lg shadow-sm"
            />
            {previewUrl ? (
              <div className="relative mb-3">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-32 object-contain rounded-lg border bg-gray-50"
                />
                <button
                  onClick={() => {
                    setScreenshot(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <label className="cursor-pointer bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-100 transition">
                  Upload Screenshot
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="flex justify-between text-lg font-bold mb-6">
            <span>Total:</span>
            <span className="text-green-600">${totalPrice}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 bg-[#002B11] text-white rounded-2xl font-bold hover:bg-black transition disabled:bg-gray-300"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>

      {/* SUCCESS MODAL (Reusable logic from your BookingPage) */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              Order Placed!
            </h2>
            <p className="text-gray-600 mb-6">
              Your order has been sent to our team for verification.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
