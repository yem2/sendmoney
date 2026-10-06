const SENSITIVE = ["password", "password_hash", "token", "jwt_secret", "authorization"];

function redact(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const clone = { ...obj };
  for (const key of Object.keys(clone)) {
    if (SENSITIVE.some((s) => key.toLowerCase().includes(s))) clone[key] = "[REDACTED]";
  }
  return clone;
}

export const logger = {
  info: (msg, meta) => console.log(JSON.stringify({ level: "info", msg, ...redact(meta) })),
  warn: (msg, meta) => console.warn(JSON.stringify({ level: "warn", msg, ...redact(meta) })),
  error: (msg, meta) => console.error(JSON.stringify({ level: "error", msg, ...redact(meta) })),
};
