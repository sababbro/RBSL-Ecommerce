import { 
  defineMiddlewares,
  MedusaRequest,
  MedusaResponse, 
  MedusaNextFunction 
} from "@medusajs/framework/http"
import Redis from "ioredis"

// Note: Ensure ioredis is installed: npm install ioredis
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")

export async function rateLimiter(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress
  const key = `rate-limit:mfs:${ip}`
  
  try {
    const current = await redis.incr(key)
    if (current === 1) {
      await redis.expire(key, 60) // 60 seconds window
    }
    
    if (current > 5) { // Limit to 5 attempts per minute per IP for MFS validation
      return res.status(429).json({
        message: "Too many attempts. Please try again later.",
        error: "MFS_VALIDATION_RATE_LIMIT_EXCEEDED"
      })
    }
  } catch (error) {
    console.error("Rate limiter error:", error)
    // Fail open or closed? For security, maybe fail closed or just proceed if Redis is down
    // Proceeding for now to avoid breaking the checkout if Redis has issues.
  }
  
  return next()
}

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/payment-collections/*/authorize",
      middlewares: [rateLimiter],
    },
    {
      matcher: "/store/payment-collections/*/payment-sessions/*",
      middlewares: [rateLimiter],
    }
  ],
})
