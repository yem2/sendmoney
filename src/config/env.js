import "dotenv/config";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL manquant — copie .env.example en .env");
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET manquant — copie .env.example en .env");

export const env = {
  port: Number(process.env.PORT) || 4001,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};
