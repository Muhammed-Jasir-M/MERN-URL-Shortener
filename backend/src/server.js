import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth_routes.js";
import urlRoutes from "./routes/url_routes.js";
import { redirectUrl } from "./controllers/url_controller.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
}));

app.use(express.json());

// Health Check Route
app.get("/health", (req, res) => {
  res.send("URL Shortener API v1 is running");
});

// API v1 Mounted Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/url", urlRoutes);

// Root Level Redirection Route (e.g. GET http://localhost:5000/xyz123)
app.get("/:shortCode", redirectUrl);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
