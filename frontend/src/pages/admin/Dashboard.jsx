import StatCard from "../../components/admin/StatCard.jsx";
import api from "../../services/api.js";
import { useState, useEffect } from "react";
import { Users, FileText, ShoppingBag, MapPin } from "lucide-react";
import BookingChart from "../../components/admin/bookinGraph.jsx";
import { getBookingStats } from "../../services/booking.service.js";
import UserChart from "../../components/admin/UserChart.jsx";

export default function Dashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [communityCount, setCommunityCount] = useState(0);
  const [chartData, setChartData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userChartData, setUserChartData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  /* ---------------- FORMAT DATA ---------------- */
  const formatData = (data) => {
    if (!Array.isArray(data)) return []; 

    return data.map((item) => ({
      month: `${item._id?.month}/${item._id?.year}`,
      bookings: item.totalBookings || 0,
      revenue: item.totalRevenue || 0,
    }));
  };

  const buildUserChartData = (users) => {
    const grouped = {};

    users.forEach((user) => {
      const date = new Date(user.created_at); 
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const key = `${month}/${year}`;

      if (!grouped[key]) {
        grouped[key] = 0;
      }

      grouped[key] += 1;
    });

    return Object.keys(grouped).map((key) => ({
      month: key,
      users: grouped[key],
    }));
  };

  /* ---------------- FETCH EVERYTHING ---------------- */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

      
        let usersRes = { data: { data: [] } };
        let postsRes = { data: { data: [] } };
        let proRes = { data: { data: [] } };
        let commRes = { data: { data: [] } };
        let bookingStats = [];

        /* -------- USERS -------- */
        try {
          usersRes = await api.get("/users");
          const users = usersRes.data.data;
          setUserChartData(buildUserChartData(users));
        } catch (e) {
          console.warn("Users API failed");
        }

        /* -------- POSTS -------- */
        try {
          postsRes = await api.get("/posts");
        } catch (e) {
          console.warn("Posts API failed");
        }

        /* -------- PRODUCTS -------- */
        try {
          proRes = await api.get("/products");
        } catch (e) {
          console.warn("Products API failed");
        }

        /* -------- COMMUNITY -------- */
        try {
          commRes = await api.get("/community-posts");
        } catch (e) {
          console.warn("Community API failed");
        }

        /* -------- BOOKING STATS -------- */
        try {
          const stats = await getBookingStats();
          bookingStats = stats || []; 
          const revenueSum = bookingStats.reduce((sum, item) => {
            // if your backend already excludes rejected → keep as is
            return sum + (item.totalRevenue || 0);
          }, 0);
          setTotalRevenue(revenueSum);
          console.log("BOOKING STATS:", bookingStats);
        } catch (e) {
          console.warn("Booking stats failed");
        }

        /* -------- SET STATE -------- */
        setUsersCount(usersRes.data?.data?.length || 0);
        setPostsCount(postsRes.data?.data?.length || 0);
        setProductCount(proRes.data?.data?.length || 0);
        setCommunityCount(commRes.data?.data?.length || 0);

        setChartData(formatData(bookingStats)); 
        // setChartData([
        //   { month: "1/2026", bookings: 1, revenue: 10 },
        //   { month: "2/2026", bookings: 3, revenue: 20 },
        //   { month: "3/2026", bookings: 2, revenue: 30 },
        //   { month: "4/2026", bookings: 5, revenue: 50 },
        // ]);  // mock test
      } catch (err) {
        console.error("MAIN DASHBOARD ERROR:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600">Loading dashboard...</div>
    );
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-200">
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-green-900">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back, Admin!</p>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={usersCount}
            icon={Users}
            accent="green"
          />
          <StatCard
            title="Total Posts"
            value={postsCount}
            icon={FileText}
            accent="blue"
          />
          <StatCard
            title="Total Products"
            value={productCount}
            icon={ShoppingBag}
            accent="purple"
          />
          <StatCard
            title="Total Community Post"
            value={communityCount}
            icon={MapPin}
            accent="rose"
          />
        </div>

        {/* EXTRA STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="Total Revenue of community"
            value={`$${totalRevenue}`}
            dark
            accent="rose"
          />
          <StatCard title="Total Revenue" value="$120" dark />
        </div>

        <div className="mb-5">
          <BookingChart data={chartData} />
        </div>
        <UserChart data={userChartData} />
      </div>
    </div>
  );
}
