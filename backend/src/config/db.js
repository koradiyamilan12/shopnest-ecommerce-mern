const { Sequelize } = require("sequelize");
const config = require("./config");

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.pass,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: "postgres",
    logging: false,
    dialectOptions:
      config.db.ssl
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
  },
);

module.exports = sequelize;
