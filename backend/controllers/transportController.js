import pool from '../db/index.js';
import redis from '../db/redis.js';

export const getTransportByCity = async (req, res) => {
  const { city_id } = req.params;
  const cacheKey = `transport:city:${city_id}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("✅ Transport served from Redis");
      return res.json(JSON.parse(cached));
    }

    const result = await pool.query(
      `SELECT * FROM get_transport_by_city($1)`,
      [city_id]
    );

    await redis.setEx(cacheKey, 900, JSON.stringify(result.rows));

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching transport:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCheapestTransportByCity = async (req, res) => {
  const { city_id } = req.params;
  const cacheKey = `transport:cheapest:city:${city_id}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("✅ Cheapest transport served from Redis");
      return res.json(JSON.parse(cached));
    }

    const result = await pool.query(
      `SELECT * FROM get_cheapest_transport($1);`,
      [city_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No transport data found for this city." });
    }


    await redis.setEx(cacheKey, 900, JSON.stringify(result.rows[0]));

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching cheapest transport:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
