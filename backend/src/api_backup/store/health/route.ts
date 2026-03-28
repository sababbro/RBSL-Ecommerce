import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
  const redisService = req.scope.resolve("redisService") // Standard Medusa v2 redis service

  const status = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: "unknown",
    redis: "unknown",
  }

  try {
    // Check Database (Supabase)
    const dbCheck = await pgConnection.raw("SELECT 1")
    status.database = dbCheck ? "healthy" : "unhealthy"
  } catch (err) {
    status.database = "error: " + (err instanceof Error ? err.message : String(err))
  }

  try {
    // Check Redis
    const redisCheck = await redisService.ping()
    status.redis = redisCheck === "PONG" ? "healthy" : "unhealthy"
  } catch (err) {
    status.redis = "error: " + (err instanceof Error ? err.message : String(err))
  }

  const isHealthy = status.database === "healthy" && status.redis === "healthy"

  res.status(isHealthy ? 200 : 503).json(status)
}
