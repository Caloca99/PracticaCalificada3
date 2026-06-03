import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const useSsl = process.env.DB_SSL === "true";
const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === "true";

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ecommerce_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: useSsl ? { rejectUnauthorized } : undefined
});

export async function testConnection() {
  const connection = await pool.getConnection();
  await connection.ping();
  connection.release();
}
