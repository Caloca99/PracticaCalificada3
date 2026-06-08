import session from "express-session";
import MySQLStoreFactory from "express-mysql-session";

const MySQLStore = MySQLStoreFactory(session);

const isProduction = process.env.NODE_ENV === "production";

export const sessionMiddleware = session({
  name: "connect.sid",
  secret: process.env.SESSION_SECRET || "caloca-gym-dev-secret",
  resave: false,
  saveUninitialized: false,
  proxy: true,
  store: new MySQLStore({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ecommerce_db",
    createDatabaseTable: true
  }),
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
});
