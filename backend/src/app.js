import express from "express";
import cors from "cors";
import path from "path";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/users.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import provinceRoutes from "./routes/province.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import likeRoutes from "./routes/like.routes.js";
import communityPostRoutes from "./routes/communityPost.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import productRoutes from "./routes/product.routes.js";
import productCategoryRoutes from "./routes/productCategory.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import orderRoutes from "./routes/order.routes.js";
import "./config/telegram.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();

//API documentation
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

const swaggerDocument = YAML.load(
  path.join(_dirname, "../../docs/api/swagger.yaml"),
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Middlewares
const allowedOrigins = [
  "http://localhost:5173",
  "https://derleng-website-9648zasiv-haysansans-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Server Static files (for ckoudinary/local images)
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/provinces", provinceRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/community-posts", communityPostRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/products", productRoutes);
app.use("/api/productCategories", productCategoryRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;
