// src/pages/Post.jsx
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css"; // default styles
import { Calendar, Clock, DollarSign, PenLine } from "lucide-react";
import api from "../services/api.js";
import { getCategories, getProvinces } from "../services/place.service";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ButtonSpinner from "../components/ButtonSpinner.jsx";


export default function PostForm() {
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    content: "",
    startDate: "",
    duration: "",
    cost: "",
    province: "",
    type: "",
    gallery: [],
    locations: [],
  });

  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [types, setTypes] = useState([]);
  const [newLocation, setNewLocation] = useState({ description: "", link: "" });
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch provinces and types on load
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const provs = await getProvinces();
        const cats = await getCategories();
        setProvinces(provs);
        setTypes(cats);
      } catch (err) {
        console.error("Failed to fetch provinces or categories:", err);
        toast.error("Failed to load provinces or categories");
      }
    };
    fetchOptions();
  }, []);

  const getFieldLabel = (field) => {
    switch (field) {
      case "title":
        return "Title";
      case "content":
        return "Content";
      case "province":
        return "Province";
      case "type":
        return "Type of Place";
      case "startDate":
        return "Start Date";
      case "duration":
        return "Duration";
      case "cost":
        return "Cost";
      case "gallery":
        return "Gallery";
      default:
        return field;
    }
  };

  // Handle input change with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: value ? "" : `${getFieldLabel(name)} is required`,
    }));
  };

  // Gallery upload
  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - post.gallery.length;

    if (remainingSlots <= 0) {
      toast.error("Maximum 5 images allowed.");
      return;
    }

    const allowedFiles = files.slice(0, remainingSlots);
    setPost((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...allowedFiles],
    }));

    if (allowedFiles.length > 0) {
      setErrors((prev) => ({ ...prev, gallery: "" }));
    }
  };

  // Add new location
  const handleSaveLocation = () => {
    if (!newLocation.description) {
      toast.error("Location description is required!");
      return;
    }

    setPost((prev) => ({
      ...prev,
      locations: [...prev.locations, newLocation],
    }));

    setNewLocation({ description: "", link: "" });
    setShowLocationForm(false);
  };

  // Publish post
  const handlePublish = async () => {
    const newErrors = {};

    ["title", "content", "province", "type"].forEach((field) => {
      if (!post[field]) {
        newErrors[field] = `${getFieldLabel(field)} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please complete required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("title", post.title);
      formData.append("content", post.content);
      formData.append("province_id", post.province);
      formData.append("category_id", post.type);
      formData.append("user_id", currentUser._id);

      if (post.startDate) {
        formData.append("trip_date", new Date(post.startDate).toISOString());
      }

      if (post.duration) {
        formData.append("trip_duration", post.duration);
      }

      if (post.cost) {
        formData.append("trip_cost", post.cost);
      }

      if (post.locations[0]) {
        formData.append("location_description", post.locations[0].description);
        formData.append("location_link", post.locations[0].link || "");
      }

      post.gallery.forEach((file) => {
        formData.append("images", file);
      });

      await api.post("/posts", formData);

      toast.success("Post published successfully!");

      setPost({
        title: "",
        content: "",
        startDate: "",
        duration: "",
        cost: "",
        province: "",
        type: "",
        gallery: [],
        locations: [],
      });

      setErrors({});
      setTimeout(() => navigate("/TravelStories"), 1000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-white font-sans text-gray-700 p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* LEFT COLUMN */}
          <div className="md:col-span-2 space-y-8">
            <header>
              <h1 className="text-3xl font-bold text-[#002B11] mb-6">
                Add an impressive title to your trip
              </h1>
              <input
                type="text"
                name="title"
                placeholder="Trip Title"
                value={post.title}
                onChange={handleChange}
                className={`w-full text-xl border-b py-3 focus:outline-none transition-colors ${
                  errors.title
                    ? "border-red-500"
                    : "border-gray-300 focus:border-green-500"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </header>

            <section className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-500">
                <PenLine size={20} className="text-[#008A3D]" />
                <span className="font-medium">Tell your trip story</span>
              </div>
              <textarea
                name="content"
                value={post.content}
                onChange={handleChange}
                placeholder="Share your experience..."
                className={`w-full h-80 border rounded-sm p-4 focus:ring-1 focus:outline-none ${
                  errors.content
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-green-500"
                }`}
              />
              {errors.content && (
                <p className="text-red-500 text-xs mt-1">{errors.content}</p>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">
            {/* Trip Details */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
                Trip Details
              </h3>
              <div className="space-y-4 text-sm">
                {/* Start Date */}
                <div>
                  <div className="flex items-start space-x-3">
                    <Calendar size={18} className="mt-0.5" />
                    <input
                      type="date"
                      name="startDate"
                      value={post.startDate}
                      onChange={handleChange}
                      className={`block w-full border p-1 text-gray-600 rounded-sm   ${
                        errors.startDate
                          ? "border-red-500 focus:ring-red-300"
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      errors.startDate ? "text-red-500" : "text-gray-400"
                    }`}
                  >
                    {errors.startDate
                      ? errors.startDate
                      : "Add start date to your trip (optional)"}
                  </p>
                </div>

                {/* Duration */}
                <div>
                  <div className="flex items-start space-x-3">
                    <Clock size={18} className="mt-0.5" />
                    <input
                      type="text"
                      name="duration"
                      placeholder="Trip Duration (e.g., 2 days)"
                      value={post.duration}
                      onChange={handleChange}
                      className={`block w-full border p-1 text-gray-600 rounded-sm ${
                        errors.duration
                          ? "border-red-500 focus:ring-red-300"
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                    />
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      errors.duration ? "text-red-500" : "text-gray-400"
                    }`}
                  >
                    {errors.duration ? errors.duration : "Duration of the trip (optional)"}
                  </p>
                </div>

                {/* Cost */}
                <div>
                  <div className="flex items-center space-x-3">
                    <DollarSign size={18} />
                    <input
                      type="number"
                      name="cost"
                      placeholder="Trip cost in USD"
                      value={post.cost}
                      onChange={handleChange}
                      className={`border rounded-sm p-1 w-full ${
                        errors.cost
                          ? "border-red-500 focus:ring-red-300"
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                      min="0"
                    />
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      errors.cost ? "text-red-500" : "text-gray-400"
                    }`}
                  >
                    {errors.cost ? errors.cost : "How much you spent (optional)"}
                  </p>
                </div>
              </div>
            </section>

            {/* Province & Type */}
            <section className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                  Province
                </label>
                <select
                  name="province"
                  onChange={handleChange}
                  value={post.province}
                  className={`w-full border p-3 rounded-sm bg-white ${
                    errors.province ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select province</option>
                  {provinces.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.province_name}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <p className="text-red-500 text-xs mt-1">{errors.province}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                  Type of Place
                </label>
                <select
                  name="type"
                  onChange={handleChange}
                  value={post.type}
                  className={`w-full border p-3 rounded-sm bg-white ${
                    errors.type ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select type</option>
                  {types.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.category_name}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                )}
              </div>
            </section>

            {/* Gallery */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Gallery ({post.gallery.length}/5)
                </h3>
                <label className="flex items-center gap-2 bg-[#008A3D] text-white text-sm font-normal px-3 py-2 rounded-lg cursor-pointer shadow hover:bg-[#006F31] transition">
                  Add Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleGalleryUpload}
                  />
                </label>
              </div>
              {errors.gallery && (
                <p className="text-red-500 text-xs mb-2">{errors.gallery}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {post.gallery.map((file, i) => (
                  <div key={i} className="relative h-24 w-24">
                    <img
                      src={URL.createObjectURL(file)}
                      className="h-24 w-24 object-cover rounded"
                      alt="Gallery"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPost((prev) => ({
                          ...prev,
                          gallery: prev.gallery.filter(
                            (_, index) => index !== i,
                          ),
                        }))
                      }
                      className="absolute top-0 right-0 bg-red-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Locations */}
            <section>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Locations ({post.locations.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowLocationForm(true)}
                  className="flex items-center gap-2 bg-[#008A3D] text-white text-sm font-normal px-3 py-2 rounded-lg hover:bg-[#006F31] transition shadow"
                >
                  Add Location
                </button>
              </div>

              {showLocationForm && (
                <div className="bg-gray-50 p-4 rounded-md shadow space-y-2 mb-2">
                  <input
                    type="text"
                    placeholder="Location description"
                    value={newLocation.description}
                    onChange={(e) =>
                      setNewLocation((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-sm p-2"
                  />
                  <input
                    type="text"
                    placeholder="Google Maps link (optional)"
                    value={newLocation.link}
                    onChange={(e) =>
                      setNewLocation((prev) => ({
                        ...prev,
                        link: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-sm p-2"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowLocationForm(false)}
                      className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveLocation}
                      className="px-3 py-1 rounded bg-[#008A3D] text-white hover:bg-[#006F31]"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              <ul className="text-sm text-gray-600 list-disc ml-5 space-y-1">
                {post.locations.map((loc, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>{loc.description}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setPost((prev) => ({
                          ...prev,
                          locations: prev.locations.filter(
                            (_, index) => index !== i,
                          ),
                        }))
                      }
                      className="text-red-500 text-xs font-bold hover:text-red-700 ml-2"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* Publish */}
            <button
              className={`w-full font-bold py-3 rounded-md flex items-center justify-center gap-2 transition-colors ${
                isSubmitting
                  ? "bg-[#008A3D] opacity-70 cursor-not-allowed"
                  : "bg-[#008A3D] text-white hover:bg-[#006F31]"
              }`}
              onClick={handlePublish}
              disabled={isSubmitting}
            >
              {isSubmitting && <ButtonSpinner size={1.25} color="white" />}
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
