import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";

/**
 * Instance Express réutilisable — n'appelle jamais app.listen() ici.
 * - En local : server.js importe cet export et appelle listen().
 * - Sur Vercel : api/index.js importe cet export et le passe tel quel
 *   au runtime serverless (chaque requête relance une fonction, pas de
 *   process persistant — d'où l'absence de app.listen()).
 */
const app = express();

app.use(helmet());
app.use(express.json({ limit: "100kb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", env.corsOrigin);
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api", routes);
app.use(errorHandler);

export default app;
