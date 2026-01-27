import pool from '../db/index.js';
import redis from '../db/redis.js';

export const getAttractionsByCity = async (req, res) => {
  const { city_id } = req.params;
  const cacheKey = `attractions:city:${city_id}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("✅ Attractions served from Redis");
      return res.json(JSON.parse(cached));
    }

    const result = await pool.query(
      `SELECT * FROM get_attractions_by_city($1)`,
      [city_id]
    );

    await redis.setEx(cacheKey, 900, JSON.stringify(result.rows));

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching attractions:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTopAttractionsByCity = async (req, res) => {
  const { city_id } = req.params;
  const cacheKey = `attractions:top:city:${city_id}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("✅ Top attractions served from Redis");
      return res.json(JSON.parse(cached));
    }

    const result = await pool.query(
      `SELECT * FROM get_top_attractions($1)`,
      [city_id]
    );

    await redis.setEx(cacheKey, 900, JSON.stringify(result.rows));

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching top attractions:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
