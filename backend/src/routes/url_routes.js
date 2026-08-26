import express from "express";
import { shortenUrl, getUrlStats, getAllUrls, deleteUrl, getStatsSummary } from "../controllers/url_controller.js";
import { optionalAuth } from "../middleware/auth_middleware.js";

const router = express.Router();

router.get("/getAllUrls", optionalAuth, getAllUrls);
router.get("/stats/summary", optionalAuth, getStatsSummary);
router.post("/shorten", optionalAuth, shortenUrl);
router.delete("/:shortCode", optionalAuth, deleteUrl);
router.get('/stats/:shortCode', getUrlStats);

export default router;
