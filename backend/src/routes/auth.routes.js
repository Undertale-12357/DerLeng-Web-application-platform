import express from "express";
import {
  login,
  sendVerificationCode,
  verifyCodeAndRegister,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/send-code", sendVerificationCode);
router.post("/register", verifyCodeAndRegister);
router.post("/login", login);

export default router;
