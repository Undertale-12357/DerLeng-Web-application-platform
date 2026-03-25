import { useState, useEffect } from "react";
import api from "../../services/api";
import CommunityCard from "./components/CommunityCard";
import CommunityModal from "./components/CommunityModal";
import CommunitySearch from "./components/CommunitySearch";
import CommunityDetail from "../CommunityPostDetail";
import { useParams, useNavigate } from "react-router-dom";

export default function Communities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [modalCommunity, setModalCommunity] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunities(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const fetchCommunities = async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      const res = await api.get(`/community-posts?page=${page}&limit=${limit}`);

      setCommunities(res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/community-posts/${deleteId}`);
      setCommunities((prev) => prev.filter((c) => c._id !== deleteId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  /* ---------------- FILTER ---------------- */
  const filtered = communities.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <div className="p-10 text-center">Loading communities...</div>;
  }

  return (
    <div>
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-green-900">Manage Community</h1>
        <p className="text-gray-500 mb-5">Manage all Community</p>
      </div>

      {/* SEARCH */}
      <CommunitySearch
        search={search}
        setSearch={setSearch}
        onCreate={() => setModalCommunity({})}
      />

      {/* GRID */}
      <div className="grid md:grid-cols-4 gap-6">
        {filtered.map((community) => (
          <CommunityCard
            key={community._id}
            post={community}
            onClick={() => navigate(`/admin/communities/${community._id}`)}
            onEdit={(post) => setModalCommunity(post)}
            onDelete={(id) => handleDelete(id)}
            onLike={(id) => console.log("Like", id)}
            onFavorite={(id) => console.log("Favorite", id)}
          />
        ))}
      </div>
      {totalPages >= 1 && (
        <div className="flex justify-between items-center px-6 py-8 border-b text-sm text-gray-500 mb-6">
          {/* ROWS PER PAGE */}
          <div className="flex items-center gap-3">
            <span>Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded-md px-2 py-1"
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
            </select>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center gap-2">
            {/* PREV */}
            <button
              onClick={() =>
                setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
              }
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border  hover:bg-green-800 hover:text-white"
            >
              Prev
            </button>

            {/* PAGE NUMBERS */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === page
                    ? "bg-green-800 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}

            {/* NEXT */}
            <button
              onClick={() =>
                setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border hover:bg-green-800 hover:text-white"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalCommunity !== null && (
        <CommunityModal
          community={modalCommunity}
          onClose={() => setModalCommunity(null)}
          onSaved={() => {
            setModalCommunity(null);
            fetchCommunities();
          }}
        />
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">
              Delete this community?
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {id && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[95%] max-w-6xl h-[90vh] rounded-xl shadow-lg relative overflow-hidden">
            {/* DETAIL */}
            <div className="h-full overflow-y-auto">
              <CommunityDetail />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
