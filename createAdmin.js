const bcrypt = require("bcryptjs");
const db = require("./db/database");

const email = "admin@tys.local";
const password = "Admin123!";
const hash = bcrypt.hashSync(password, 10);

db.prepare(`
INSERT OR IGNORE INTO users (email, password_hash, role)
VALUES (?, ?, 'admin')
`).run(email, hash);

console.log("Admin pronto:");
console.log("Email:", email);
console.log("Password:", password);