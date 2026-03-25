import express from "express";
import { toggleLike, getLikesCount, getLikeStatus } from "../controllers/like.controller.js";

import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/toggle", protect, toggleLike);

router.get("/count", getLikesCount);

router.get("/status", protect, getLikeStatus);

export default router;
