// ✅ backend/routes/images.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// ✅ Use environment variables for keys
const UNSPLASH_KEY = process.env.UNSPLASH_KEY || "0mEN7Gf018S_8s_HT3tkd4qLHF1_IF-aaMbNOnvKbBg";
const PEXELS_KEY = process.env.PEXELS_KEY || "OleaUpw56ORJxHnwMfMQ5aBUFA9AtsMcBQxKGEFRyn4TsPSNTqjfUOWh";

// ============================
// 🖼️ Unsplash Proxy
// ============================
router.get("/unsplash", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query
    )}&client_id=${UNSPLASH_KEY}&orientation=landscape&per_page=1`;

    const response = await fetch(url);
    const data = await response.json();

    return res.json(data);
  } catch (error) {
    console.error("Unsplash fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch from Unsplash" });
  }
});

// ============================
// 🖼️ Pexels Proxy
// ============================
router.get("/pexels", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      query
    )}&orientation=landscape&per_page=1`;

    const response = await fetch(url, {
      headers: { Authorization: PEXELS_KEY },
    });

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error("Pexels fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch from Pexels" });
  }
});

export default router;