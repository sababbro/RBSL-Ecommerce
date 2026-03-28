const { loadEnv, defineConfig } = require('@medusajs/framework/utils');
const path = require('path');

try {
  console.log("Current working directory:", process.cwd());
  console.log(" __dirname:", __dirname);
  
  loadEnv(process.env.NODE_ENV || 'development', process.cwd());
  console.log("Env loaded successfully");
  
  const config = require('./dist/medusa-config.js');
  console.log("Config required successfully:", JSON.stringify(config, null, 2));
} catch (error) {
  console.error("Failed to load config:");
  console.error(error);
}
