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
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-manual",
            id: "manual",
            options: {},
          },
          {
            resolve: "./src/modules/rbsl-payment-manual",
            id: "rbsl-bank-transfer",
            options: {},
          },
        ],
      },
    },
  },
  plugins: [
    {
      resolve: `medusa-file-supabase`,
      options: {
        url: process.env.SUPABASE_URL,
        public_url: process.env.SUPABASE_URL + "/storage/v1/object/public/medusa-media",
        key: process.env.SUPABASE_KEY,
        bucket: "medusa-media",
      },
    },
    {
      resolve: `medusa-plugin-meilisearch`,
      options: {
        config: {
          host: process.env.MEILISEARCH_HOST,
          apiKey: process.env.MEILISEARCH_API_KEY,
        },
        settings: {
          products: {
            indexSettings: {
              searchableAttributes: ["title", "description", "handle"],
              displayedAttributes: ["id", "title", "description", "handle", "thumbnail"],
            },
          },
        },
      },
    },
  ],
})
