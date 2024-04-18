import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: "https://usw1-poetic-mustang-34191.upstash.io",
  token: process.env.REDIS_KEY!,
});
