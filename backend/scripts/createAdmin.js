import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { pool, testConnection } from "../src/config/db.js";
import { findUserByEmail } from "../src/models/userModel.js";

dotenv.config();

const ADMIN_NAME = process.env.ADMIN_NAME || "Admin Caloca";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@calocagym.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin1234";

async function main() {
  await testConnection();

  const existing = await findUserByEmail(ADMIN_EMAIL);
  if (existing) {
    console.log(`El usuario ${ADMIN_EMAIL} ya existe. Se omite la creacion.`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')",
    [ADMIN_NAME, ADMIN_EMAIL, passwordHash]
  );

  console.log(`Admin creado: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  await pool.end();
}

main().catch((error) => {
  console.error("Error creando admin:", error.message);
  process.exit(1);
});
