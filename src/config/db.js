import pg from "pg";
import { env } from "./env.js";

/**
 * Pool de connexions vers Neon. Neon étant serverless, le pool se
 * reconnecte automatiquement après une mise en veille du compute
 * (comportement normal, pas une erreur à corriger).
 */
export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  ssl: { rejectUnauthorized: true },
  max: 10,
  idleTimeoutMillis: 30000,
});

export async function query(text, params) {
  return pool.query(text, params);
}
