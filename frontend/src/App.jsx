// frontend/src/App.jsx
import { Route, Routes, useLocation } from "react-router-dom";

import Master from "./layout/Master";
import Home from "./pages/Home";
import About from "./pages/About";
import DiscoverPage from "./pages/DiscoverPage";
import Profile from "./pages/Profile";
import TravelStories from "./pages/TravalStories.jsx";
import FAQ from "./pages/FAQ.jsx";
import PostListPage from "./pages/PostListpage.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx"; 

import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminLayout from "./layout/admin/AdminLayout.jsx";
import Users from "./pages/admin/Users.jsx";
import Posts from "./pages/admin/Posts.jsx";
import Products from "./pages/admin/Products.jsx";
import Communities from "./pages/admin/Community.jsx";
import CommunityPostDetail from "./pages/CommunityPostDetail.jsx";
import BookingPage from "./pages/BookingPage";
import CommunityByProvince from "./pages/CommunityByProvince.jsx";
import CommunityBooking from "./pages/admin/communityBooking";
import PostPageWrapper from "./components/PostPageWrapper.jsx";
import DetailPageWrapper from "./components/DetailPageWrapper.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Orders from "./pages/admin/Orders.jsx";
import PostByProvince from "./pages/PostByProvince.jsx"; 


const App = () => {
  const location = useLocation();
  const state = location.state;

  return (
    <Routes>
      {/* Main Layout */}

      <Route path="/" element={<Master />}>
        <Route index element={<Home />} />

        {/* Shop */}
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:id" element={<ProductDetail />} />

        {/*  CART */}
        {<Route path="cart" element={<Cart />} />}

        <Route path="about" element={<About />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="discover" element={<DiscoverPage />} />

        {/* Posts */}
        <Route path="post" element={<PostPageWrapper />} />
        <Route path="posts/:id" element={<DetailPageWrapper />} />
        <Route path="posts/category/:categoryId" element={<PostListPage />} />
        {/* <Route path="posts/province/:provinceId" element={<PostListPage />} /> */}

        {/* Profile */}

        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Community */}
        <Route path="community/:id" element={<CommunityPostDetail />} />
        <Route
          path="community/province/:provinceId"
          element={<CommunityByProvince />}
        />
        <Route path="posts/province/:provinceId" element={<PostByProvince />} />
        <Route path="booking/:id" element={<BookingPage />} />

        {/* Other Pages */}
        <Route path="stories" element={<div>Stories</div>} />
        <Route path="TravelStories" element={<TravelStories />} />
      </Route>

      {/* Modal-style Routes (optional background location) */}
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/booking/:id" element={<BookingPage />} />
        </Routes>
      )}

      {/* Admin Layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />

        <Route path="posts">
          <Route index element={<Posts />} />
          <Route path=":id" element={<Posts />} />
        </Route>

        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />

        <Route path="communities">
          <Route index element={<Communities />} />
          <Route path=":id" element={<Communities />} />
        </Route>

        <Route path="bookings" element={<CommunityBooking />} />
      </Route>
    </Routes>
  );
};

export default App;