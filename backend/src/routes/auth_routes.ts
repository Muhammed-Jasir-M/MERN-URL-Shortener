import express from "express";
import { registerUser, loginUser, getMe, updateProfile } from "../controllers/auth_controller.js";
import { requireAuth } from "../middleware/auth_middleware.js";

const router = express.Router();

// Auth Endpoints
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", requireAuth, getMe);
router.put("/profile", requireAuth, updateProfile);

export default router;
