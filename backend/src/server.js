import dotenv from "dotenv";
import app from "./app.js";
import { testConnection } from "./config/db.js";
import { ensureDefaultAdmin, runMigrations } from "./config/migrations.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await testConnection();
    await runMigrations();
    await ensureDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Could not start server:", error.message);
    process.exit(1);
  }
}

startServer();
