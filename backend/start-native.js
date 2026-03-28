const express = require("express");
const medusaLoader = require("@medusajs/medusa/dist/loaders").default;
const path = require("path");
const { loadEnv } = require("@medusajs/framework/utils");

async function start() {
  const app = express();
  const rootDirectory = path.resolve(__dirname);
  
  // Ensure env is loaded for the loader
  loadEnv(process.env.NODE_ENV || 'development', rootDirectory);

  try {
    console.log("Starting Medusa natively from:", rootDirectory);
    
    // The loader will handle configuration, database connection, and API routes
    const { shutdown } = await medusaLoader({
      directory: rootDirectory,
      expressApp: app,
    });
    
    const port = 9000;
    app.listen(port, () => {
      console.log(`\n✅ RBSL Backend is LIVE on port ${port}`);
      console.log(`Health check: http://localhost:${port}/health\n`);
    });
  } catch (error) {
    console.error("\n❌ Failed to start Medusa natively:");
    console.error(error);
    process.exit(1);
  }
}

start();
