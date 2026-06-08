import { pool } from "../config/db.js";

export async function createUser({ name, email, passwordHash, role = "user" }) {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, role]
  );
  return findUserById(result.insertId);
}

export async function findUserByEmail(email) {
  const [rows] = await pool.query(
    "SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = ?",
    [email]
  );
  return rows[0];
}

export async function findUserById(id) {
  const [rows] = await pool.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0];
}

export async function findAllUsers() {
  const [rows] = await pool.query(
    "SELECT id, name, email, role, created_at FROM users ORDER BY id DESC"
  );
  return rows;
}

export async function countUsers() {
  const [rows] = await pool.query("SELECT COUNT(*) AS total FROM users");
  return rows[0].total;
}
