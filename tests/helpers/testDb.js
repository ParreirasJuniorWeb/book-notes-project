import db from "../../database/conn.js";

export async function cleanDatabase() {
  // Ordem importa por FK
  await db.query("DELETE FROM books");
  await db.query("DELETE FROM users");
}

export async function closeDatabase() {
  await db.close();
}
