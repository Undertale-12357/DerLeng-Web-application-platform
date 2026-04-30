import React, { useState, useEffect } from "react";
import bookingService from "../services/booking.service";
import serviceService from "../services/service.service";
import { useParams } from "react-router-dom";
import qrImage from "../assets/QR.jpg";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BookingPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    gender: "",
    age: "",
    phone_number: "",
    province: "",
    booking_date: "",
    trip_duration: 1,
    number_of_people: 1,
    note: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!form.name) newErrors.name = "Name is required";

    if (!form.gender) newErrors.gender = "Gender is required";

    if (!form.age) {
      newErrors.age = "Age is required";
    } else if (form.age <= 0) {
      newErrors.age = "Age must be greater than 0";
    }

    if (!form.phone_number) {
      newErrors.phone_number = "Phone is required";
    }

    if (!form.province || form.province === "Select Province") {
      newErrors.province = "Location is required";
    }

    if (!form.booking_date) {
      newErrors.booking_date = "Date is required";
    } else {
      const selectedDate = new Date(form.booking_date);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.booking_date = "Cannot select past date";
      }
    }

    if (!form.trip_duration || form.trip_duration < 1) {
      newErrors.trip_duration = "Duration must be at least 1 day";
    }

    if (!form.number_of_people || form.number_of_people < 1) {
      newErrors.number_of_people = "Must be at least 1 person";
    }

    if (selectedServices.length === 0) {
      newErrors.services = "Select at least one service";
    }

    if (!transactionImage) {
      newErrors.transaction_image = "Transaction image required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [transactionImage, setTransactionImage] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const provinces = [
    "Phnom Penh",
    "Siem Reap",
    "Battambang",
    "Kampot",
    "Kep",
    "Preah Sihanouk",
    "Koh Kong",
    "Kratie",
    "Mondulkiri",
    "Ratanakiri",
  ];

  useEffect(() => {
    const fetchServices = async () => {
      const data = await serviceService.getByCommunity(id);
      setServices(data.data || data.services || data);
    };

    fetchServices();
  }, [id]);

  useEffect(() => {
    const selected = services.filter((s) => selectedServices.includes(s._id));

    const serviceTotal = selected.reduce((sum, s) => sum + s.price, 0);

    let total = serviceTotal * form.number_of_people * form.trip_duration;

    if (form.number_of_people >= 5) {
      total = total * 0.8;
    }

    setTotalPrice(total);
  }, [selectedServices, services, form.number_of_people, form.trip_duration]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("community_post_id", id);
      formData.append("services", JSON.stringify(selectedServices));
      formData.append("name", form.name);
      formData.append("age", form.age);
      formData.append("gender", form.gender);
      formData.append("phone_number", form.phone_number);
      formData.append("current_location", form.province);
      formData.append("trip_duration", form.trip_duration);
      formData.append("number_of_people", form.number_of_people);
      formData.append("booking_date", form.booking_date);
      formData.append("note", form.note);
      formData.append("transaction_image", transactionImage);

      await bookingService.createBooking(formData);
      setShowSuccess(true);
    } catch (err) {
      alert("Booking failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="w-full h-full overflow-y-auto p-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="fixed top-20 left-4 z-50 bg-white shadow-md p-3 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 transition duration-200"
        >
          <ArrowLeft size={22} />
        </button>

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-semibold text-green-900">
            Community Tourism Booking
          </h1>
          <p className="text-gray-500 text-sm">
            Sustainable travel experiences
          </p>
        </div>

        {/* INFO BOX */}
        <div className="max-w-5xl mx-auto bg-green-50 border border-green-100 rounded-xl p-5 mb-8">
          <h2 className="font-semibold text-green-900 mb-1">
            Plan Your Nature Adventure
          </h2>
          <p className="text-sm text-gray-600">
            Complete this booking form to start your eco-tourism journey with
            local communities.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          {/* LEFT SIDE */}
          <form className="space-y-6">
            {/* PERSONAL INFO */}
            <div>
              <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4">
                Personal Information
              </h3>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>

              <input
                name="name"
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 mb-1 ${
                  errors.name ? "border-red-500" : "border-gray-400"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>

                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      onChange={handleChange}
                      className="accent-green-600 w-4 h-4"
                    />
                    Male
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      onChange={handleChange}
                      className="accent-green-600 w-4 h-4"
                    />
                    Female
                  </label>
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-xs">{errors.gender}</p>
                )}
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                name="age"
                type="number"
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 mb-1 ${
                  errors.age ? "border-red-500" : "border-gray-400"
                }`}
              />
              {errors.age && (
                <p className="text-red-500 text-xs">{errors.age}</p>
              )}

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                name="phone_number"
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 mb-1 ${
                  errors.phone_number ? "border-red-500" : "border-gray-400"
                }`}
              />
              {errors.phone_number && (
                <p className="text-red-500 text-xs">{errors.phone_number}</p>
              )}

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Location <span className="text-red-500">*</span>
              </label>
              <select
                name="province"
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 ${
                  errors.province ? "border-red-500" : "border-gray-400"
                }`}
              >
                {errors.province && (
                  <p className="text-red-500 text-xs">{errors.province}</p>
                )}
                <option>Select Province</option>
                {provinces.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* TRIP DETAILS */}
            <div>
              <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4">
                Trip Details
              </h3>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of People <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                name="number_of_people"
                value={form.number_of_people}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 mb-1 ${
                  errors.number_of_people ? "border-red-500" : "border-gray-400"
                }`}
              />

              {errors.number_of_people && (
                <p className="text-red-500 text-xs">
                  {errors.number_of_people}
                </p>
              )}

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trip Start <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="booking_date"
                min={new Date().toISOString().split("T")[0]}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 mb-1 ${
                  errors.booking_date ? "border-red-500" : "border-gray-400"
                }`}
              />
              {errors.booking_date && (
                <p className="text-red-500 text-xs">{errors.booking_date}</p>
              )}

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trip Duration (days) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="trip_duration"
                value={form.trip_duration}
                onChange={handleChange}
                className={`w-full border rounded-lg p-3 mb-1 ${
                  errors.trip_duration ? "border-red-500" : "border-gray-400"
                }`}
              />
              {errors.trip_duration && (
                <p className="text-red-500 text-xs">{errors.trip_duration}</p>
              )}
            </div>

            {/* SERVICES */}
            <div>
              <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4">
                Services & Preferences <span className="text-red-500">*</span>
              </h3>

              <div className="space-y-3">
                {Array.isArray(services) &&
                  services.map((service) => (
                    <label
                      key={service._id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        onChange={() => toggleService(service._id)}
                        className="accent-green-600 w-4 h-4"
                      />

                      <span className="text-sm text-gray-700">
                        {service.name} (${service.price})
                      </span>
                    </label>
                  ))}
                {errors.services && (
                  <p className="text-red-500 text-sm">{errors.services}</p>
                )}
              </div>
            </div>

            {/* TOTAL */}
            <div className="text-lg font-semibold text-green-900">
              Total Price: ${totalPrice}
            </div>
          </form>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4 ">
                Additional Information
              </h3>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requirements or Note
              </label>
              <textarea
                name="note"
                onChange={handleChange}
                placeholder="Special requirements..."
                className="w-full border border-gray-400 rounded-lg p-3 
             focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 
             hover:border-green-400 transition"
              />
            </div>

            {/* QR CARD */}
            <div className="bg-white shadow-md rounded-xl p-4 flex justify-center">
              <img src={qrImage} alt="QR" className="w-52" />
            </div>

            {/* FILE UPLOAD */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Transaction <span className="text-red-500">*</span>
              </label>

              {/* INPUT */}
              <input
                id="transaction_image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setTransactionImage(file);
                  }
                }}
              />

              {/* CLICKABLE BOX */}
              <label
                htmlFor="transaction_image"
                className="w-full flex flex-col items-center justify-center px-4 py-6 bg-white border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
              >
                {/* ICON */}
                <svg
                  className="w-8 h-8 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16V4m0 0l-4 4m4-4l4 4M17 20v-8m0 0l-4 4m4-4l4 4"
                  />
                </svg>

                <p className="text-sm text-gray-500">Click to upload image</p>
              </label>

              {transactionImage && (
                <div className="mt-3 relative w-32">
                  <img
                    src={URL.createObjectURL(transactionImage)}
                    alt="Preview"
                    onClick={() =>
                      setPreview(URL.createObjectURL(transactionImage))
                    }
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300 cursor-zoom-in"
                  />

                  {/* REMOVE BUTTON */}
                  <button
                    type="button"
                    onClick={() => setTransactionImage(null)}
                    className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* PREVIEW */}
              {preview && (
                <div
                  className="fixed inset-0 bg-black/90 flex items-center justify-center z-[999]"
                  onClick={() => setPreview(null)}
                >
                  <button
                    onClick={() => setPreview(null)}
                    className="absolute top-5 right-5 text-white text-3xl"
                  >
                    ✕
                  </button>

                  <img
                    src={preview}
                    onClick={(e) => e.stopPropagation()}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
              {errors.transaction_image && (
                <p className="text-red-500 text-sm">
                  {errors.transaction_image}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-900 hover:bg-green-800 cursor-pointer"
              }`}
            >
              {loading ? "Booking..." : "Complete Booking"}
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-16 bg-green-900 text-white text-center py-6 text-sm">
          Thank you for choosing sustainable community tourism
        </div>
      </div>
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-[320px]">
            <h2 className="text-xl font-bold text-green-700 mb-2">
              Booking Successful 🎉
            </h2>

            <p className="text-gray-500 mb-4">Thank you for your booking!</p>

            <button
              onClick={() => navigate("/profile?tab=booking")}
              className="bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
