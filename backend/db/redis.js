import { createClient } from "redis";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), '.env') }); 

console.log("Connecting to Redis at:", process.env.REDIS_URL); 

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on('error', err => console.error('Redis Client Error', err));

await redis.connect();

export default redis;