const { Sequelize } = require("sequelize");
require("dotenv").config();

// For trust auth, we need null (not undefined or empty string)
const password =
  process.env.DB_PASSWORD === "" ? null : process.env.DB_PASSWORD;

const sequelize = new Sequelize(
  process.env.DB_NAME || "todoapp",
  process.env.DB_USER || "postgres",
  password, // null for no password with trust auth
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    dialectOptions: {
      ssl: false,
    },
  },
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connection successful!");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.log("💡 Using mock data for now...");
    return false;
  }
};

module.exports = { sequelize, testConnection };
