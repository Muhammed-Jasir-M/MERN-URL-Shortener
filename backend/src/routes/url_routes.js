import express from "express";
import { shortenUrl, redirectUrl, getUrlStats, getAllUrls, deleteUrl, getStatsSummary } from "../controllers/url_controller.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("URL Shortener Service is running");
});
router.get("/getAllUrls", getAllUrls);
router.get("/stats/summary", getStatsSummary);
router.post("/shorten", shortenUrl);
router.delete("/url/:shortCode", deleteUrl);
router.get('/stats/:shortCode', getUrlStats);
router.get("/:shortCode", redirectUrl);

export default router;
