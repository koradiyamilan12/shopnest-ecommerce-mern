const { Sequelize } = require("sequelize");
require("dotenv").config();
const dbConfigs = require("./database.json");

const env = process.env.NODE_ENV || "development";
const config = dbConfigs[env] || {};

const dbName = process.env.DB_NAME || config.DB_NAME;
const dbUser = process.env.DB_USER || config.DB_USER;
const dbPass = process.env.DB_PASS || config.DB_PASS;
const dbHost = process.env.DB_HOST || config.DB_HOST;
const dbPort = process.env.DB_PORT || config.DB_PORT;

const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPass,
  {
    host: dbHost,
    port: Number(dbPort),
    dialect: "postgres",
    logging: false,
  },
);

module.exports = sequelize;
