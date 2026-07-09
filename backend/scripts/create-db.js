const { Client } = require("pg");
const path = require("path");
require("dotenv").config();
const dbConfigs = require("../src/config/database.json");

async function createDatabases() {
  const envs = Object.keys(dbConfigs);

  for (const env of envs) {
    const config = dbConfigs[env];
    const dbName = config.DB_NAME;
    const dbUser = config.DB_USER || "postgres";
    const dbPass = config.DB_PASS || "";
    const dbHost = config.DB_HOST || "localhost";
    const dbPort = config.DB_PORT || 5432;

    console.log(`Checking database "${dbName}" for environment "${env}"...`);

    // Connect to the default 'postgres' database to check and run CREATE DATABASE
    const client = new Client({
      user: dbUser,
      password: dbPass,
      host: dbHost,
      port: Number(dbPort),
      database: "postgres",
    });

    try {
      await client.connect();
      // Check if DB exists
      const res = await client.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [dbName]
      );
      if (res.rowCount === 0) {
        // Create DB
        await client.query(`CREATE DATABASE "${dbName}"`);
        console.log(`✅ Database "${dbName}" created successfully!`);
      } else {
        console.log(`ℹ️ Database "${dbName}" already exists.`);
      }
    } catch (err) {
      console.error(`❌ Error creating database "${dbName}":`, err.message);
    } finally {
      await client.end();
    }
  }
}

createDatabases();
