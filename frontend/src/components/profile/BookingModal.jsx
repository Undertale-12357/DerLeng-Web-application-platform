import {
  X,
  MapPin,
  Calendar,
  Users,
  Clock,
  User,
  MapPinned,
  CheckCircle,
  XCircle,
  Phone,
  DollarSign,
  
} from "lucide-react";
import { useState } from "react";

export default function BookingModal({ selectedBooking, setSelectedBooking }) {
  const [preview, setPreview] = useState(null);

  if (!selectedBooking) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl max-h-[90vh] overflow-y-auto scrollbar-none">
          {/* HEADER */}
          <div className="flex justify-between items-center border-b border-gray-200 p-5">
            <h2 className="text-xl font-bold text-gray-800">Booking Detail</h2>
            <button
              onClick={() => setSelectedBooking(null)}
              className="text-gray-400 hover:text-black transition"
            >
              <X size={22} />
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-6 space-y-5">
            {/* TITLE WITH ICON */}
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-green-600" />
              <h3 className="font-semibold text-lg text-gray-800">
                {selectedBooking?.community_post_id?.title || "No title"}
              </h3>
            </div>

            {/* STATUS */}
            <div className="flex items-center gap-2">
              {selectedBooking.status === "approved" && (
                <CheckCircle size={16} className="text-green-600" />
              )}
              {selectedBooking.status === "rejected" && (
                <XCircle size={16} className="text-red-500" />
              )}
              {selectedBooking.status === "pending" && (
                <Clock size={16} className="text-yellow-500" />
              )}
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  selectedBooking.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : selectedBooking.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {selectedBooking.status.charAt(0).toUpperCase() +
                  selectedBooking.status.slice(1)}
              </span>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                <span>{selectedBooking.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <Users size={16} className="text-purple-400" />
                <span>{selectedBooking.number_of_people} people</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-400" />
                <span>{formatDate(selectedBooking.booking_date)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock size={16} className="text-yellow-500" />
                <span>{selectedBooking.trip_duration} days</span>
              </div>

              <div className="flex items-center gap-2 col-span-2">
                <MapPinned size={16} className="text-green-500" />
                <span>{selectedBooking.current_location}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-gray-500" />
              <span>{selectedBooking.phone_number}</span>
            </div>

            {/* SERVICES */}
            {selectedBooking.services?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-gray-800">Services</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {selectedBooking.services.map((s) => (
                    <li key={s._id} className="flex gap-5">
                      <span>{s.name}</span>
                      <span className="font-medium">${s.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex font-semibold items-center gap-2">
              Total
              <DollarSign size={16} className="text-green-400" />
              <span>{selectedBooking.total_price}</span>
            </div>
            {/* NOTE */}
            {selectedBooking.note && (
              <div>
                <h4 className="font-semibold mb-1 text-gray-800">Note</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedBooking.note}
                </p>
              </div>
            )}
            {selectedBooking.admin_note && (
              <div>
                <h4 className="font-semibold mt-3 mb-1 text-gray-800">
                  Admin Note
                </h4>
                <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-100">
                  {selectedBooking.admin_note}
                </p>
              </div>
            )}

            {/* TRANSACTION IMAGE */}
            {selectedBooking.transaction_image && (
              <div>
                <h4 className="font-semibold mb-2 text-gray-800">
                  Transaction
                </h4>
                <img
                  src={selectedBooking.transaction_image}
                  className="w-full max-h-[300px] object-contain rounded-lg cursor-pointer hover:opacity-90 transition"
                  alt="transaction"
                  onClick={() => setPreview(selectedBooking.transaction_image)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* IMAGE PREVIEW MODAL */}
      {preview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          {/* Close button */}
          <button
            onClick={() => setPreview(null)}
            className="absolute top-5 right-5 text-white text-2xl z-70 hover:text-gray-300 transition"
          >
            ✕
          </button>

          <img
            src={preview}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
            alt="preview"
          />
        </div>
      )}
    </>
  );
}