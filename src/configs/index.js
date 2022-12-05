// Importing dotenv package to config
const dotenv = require("dotenv");

dotenv.config();

const config = {
  PORT: process.env.PORT || 80,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY,
};

module.exports = config;
