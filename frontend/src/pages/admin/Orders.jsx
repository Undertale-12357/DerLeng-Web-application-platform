import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/order.service";
import { format } from "date-fns";
import {Search, Inbox, Archive, Filter} from "lucide-react"

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setStatusFilter("all");
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSlip = (transactionImage) => {
    if (!transactionImage) {
      alert("No image found for this order");
      return;
    }

    if (transactionImage.startsWith("http://") || transactionImage.startsWith("https://")) {
      console.log("Image Debugging - Cloud URL:", transactionImage);
      setSelectedImage(transactionImage);
      return;
    }

    const envUrl = String(import.meta.env.VITE_API_URL || "http://localhost:5000");
    const API_BASE_URL = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;

    let cleanPath = transactionImage.replace(/\\/g, "/");

    const finalPath = cleanPath.startsWith("uploads/")
      ? cleanPath
      : `uploads/${cleanPath}`;
    const fullUrl = `${API_BASE_URL}/${finalPath}`;
    console.log("Image Debugging - Full URL:", fullUrl);
    setSelectedImage(fullUrl);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o,
        ),
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const isArchived = ["delivered", "cancelled"].includes(order.status);
    const matchesTab = activeTab === "archive" ? isArchived : !isArchived;

    const matchesSearch =
      order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone_number?.includes(searchTerm) ||
      order._id.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesTab && matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-10 text-center">Loading Orders...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-[#002B11]">Order Management</h1>
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name, phone, or ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-green-600 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="appearance-none pl-4 pr-10 py-2 rounded-xl border bg-white focus:outline-green-600 font-medium text-gray-700 cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {activeTab === "active" ? (
              <>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
              </>
            ) : (
              <>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </>
            )}
          </select>
          <Filter
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-2 px-4 flex items-center gap-2 font-medium transition ${activeTab === "active" ? "border-b-2 border-green-700 text-green-700" : "text-gray-400"}`}
        >
          <Inbox size={18} /> Active Orders
        </button>
        <button
          onClick={() => setActiveTab("archive")}
          className={`pb-2 px-4 flex items-center gap-2 font-medium transition ${activeTab === "archive" ? "border-b-2 border-green-700 text-green-700" : "text-gray-400"}`}
        >
          <Archive size={18} /> Archive
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
            <tr>
              <th className="p-4">Customer / Date</th>
              <th className="p-4">Contact & Address</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="font-bold text-gray-800">
                      {order.user?.username || "Guest"}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {format(new Date(order.createdAt), "PPP p")}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-gray-800">
                      {order.phone_number}
                    </div>
                    <div className="text-xs text-gray-500 italic truncate max-w-[150px]">
                      {order.shipping_address || "No Address"}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600">
                      {order.items?.length} items
                    </span>
                  </td>
                  <td className="p-4 font-bold text-green-700">
                    ${order.total_price}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleViewSlip(order.transaction_image)}
                      className="text-blue-600 underline text-sm"
                    >
                      View Slip
                    </button>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "delivered"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="p-1 text-sm border rounded bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Proccessing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="p-10 text-center text-gray-400 italic"
                >
                  No orders found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* LIGHTBOX FOR SLIP VERIFICATION */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-10"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-lg w-full bg-white p-2 rounded-lg">
            <button className="absolute -top-10 right-0 text-white text-xl">
              ✕ Close
            </button>
            <img
              src={selectedImage}
              alt="Payment Receipt"
              className="w-full h-auto rounded shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
