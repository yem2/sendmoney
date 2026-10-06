import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

/**
 * bcryptjs est compatible avec les hashes générés côté SQL par
 * pgcrypto `crypt(password, gen_salt('bf'))` — les deux produisent le
 * même format de hash bcrypt standard ($2a$/$2b$...).
 */
function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status };
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email et mot de passe requis." });

    const { rows } = await query("SELECT * FROM users WHERE email = $1", [email]);
    const user = rows[0];

    // Même message générique que l'email existe ou non — évite de révéler
    // quels comptes existent (énumération d'utilisateurs).
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Identifiants invalides." });
    }
    if (user.status !== "active") {
      return res.status(403).json({ error: "Ce compte est désactivé." });
    }

    logger.info("Connexion réussie", { userId: user.id });
    res.json({ user: toPublicUser(user), token: signToken(user) });
  } catch (err) {
    next(err);
  }
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Nom, email et mot de passe requis." });
    if (password.length < 8) return res.status(400).json({ error: "Le mot de passe doit faire au moins 8 caractères." });

    const passwordHash = await bcrypt.hash(password, 12);
    const { rows } = await query(
      `INSERT INTO users (name, email, password_hash, role, status)
       VALUES ($1, $2, $3, 'user', 'active')
       RETURNING *`,
      [name, email, passwordHash]
    );
    const user = rows[0];
    logger.info("Nouvel utilisateur inscrit", { userId: user.id });
    res.status(201).json({ user: toPublicUser(user), token: signToken(user) });
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "Cet email est déjà utilisé." });
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const { rows } = await query("SELECT * FROM users WHERE id = $1", [req.user.id]);
    if (!rows[0]) return res.status(404).json({ error: "Utilisateur introuvable." });
    res.json({ user: toPublicUser(rows[0]) });
  } catch (err) {
    next(err);
  }
}
