import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || ((): never => { throw new Error("JWT_SECRET is required") })(),
      cookieSecret: process.env.COOKIE_SECRET || ((): never => { throw new Error("COOKIE_SECRET is required") })(),
    },
    databaseDriverOptions: {
      connection: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    },
    redisUrl: process.env.REDIS_URL,
  },
  admin: {
    disable: false,
    path: "/app",
    backendUrl: "http://localhost:9000",
  },
  modules: {
    b2b: {
      resolve: "./src/modules/b2b",
    },
  },
})
