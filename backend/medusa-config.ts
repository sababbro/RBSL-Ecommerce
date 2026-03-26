import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    databaseDriverOptions: {
      connection: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    },
  },
  modules: {
    b2b: {
      resolve: "./src/modules/b2b",
    },
    payment: {
      resolve: "@medusajs/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/payment-manual",
            id: "rbsl-corporate-credit",
            options: {},
          },
          {
            resolve: "./src/modules/rbsl-payment-bkash",
            id: "rbsl-bkash",
            options: {},
          },
          {
            resolve: "./src/modules/rbsl-payment-nagad",
            id: "rbsl-nagad",
            options: {},
          },
        ],
      },
    },
  },
})
