import express from "express";
import { shortenUrl, redirectUrl, getUrlStats, getAllUrls } from "../controllers/url_controller.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("URL Shortener Service is running");
});
router.get("/getAllUrls", getAllUrls);
router.post("/shorten", shortenUrl);
router.get("/:shortCode", redirectUrl);
router.get('/stats/:shortCode', getUrlStats);

export default router;

