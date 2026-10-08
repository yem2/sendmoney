// Point d'entrée Vercel : chaque requête vers /api/* exécute cette fonction
// serverless, qui délègue entièrement à l'app Express (routes, middlewares,
// gestion d'erreurs identiques à l'exécution locale).
import app from "../src/app.js";

export default app;
