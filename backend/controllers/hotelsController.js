import pool from '../db/index.js'
import redis from '../db/redis.js'

export const getHotelsByCity = async (req, res) => {
  const { city_id } = req.params;
  const cacheKey = `hotels:city:${city_id}`;

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log("✅ Served from Redis cache");
      return res.json(JSON.parse(cachedData));
    }

    const result = await pool.query(
      `SELECT * FROM get_hotels_by_city($1)`,
      [city_id]
    );

    await redis.setEx(
      cacheKey,
      900,
      JSON.stringify(result.rows)
    );

    res.json(result.rows);

  } catch (err) {
    console.error("Error fetching hotels:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const addHotel = async(req,res)=>{
    const{city_id,hotel_name,price_per_night,rating} = req.body;
    try{
        const result = await pool.query(
            `CALL add_new_hotel($1,$2,$3,$4)`,[city_id,hotel_name,price_per_night,rating]
        );
        res.json({message: "Hotel Added Successfully"});

    }catch(err){
        console.error("Error adding hotel:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getTopHotelsByCity = async (req, res) => {
  const { city_id } = req.params;
  const cacheKey = `hotels:top:city:${city_id}`;

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log("✅ Served from Redis cache");
      return res.json(JSON.parse(cachedData));
    }

    const result = await pool.query(
      'SELECT * FROM get_top_hotels_by_city($1)',
      [city_id]
    );

    await redis.setEx(
      cacheKey,
      900,
      JSON.stringify(result.rows)
    );

    res.json(result.rows);

  } catch (err) {
    console.error("Error fetching top hotels:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


