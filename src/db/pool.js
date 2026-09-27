import pkg from "pg";
import { configDotenv } from "dotenv";

configDotenv();

const { Pool } = pkg;

const env = process.env;
const db = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

db.on("connect", (_) => {
  console.log("connected to PostgreSQL database");
});

db.on("error", (err) => {
  console.error("unexpected error to idle client", err);
  process.exit(-1);
});

export default db;
