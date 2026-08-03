// middlewares/authGuard.js
import jwt from "jsonwebtoken";
import db from "../database/conn.js";

const jwtSecret = process.env.JWT_SECRET;

export default async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ error: "Token de acesso não fornecido" });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const result = await db.query("SELECT * FROM users WHERE id = $1", [decoded.id]);
    
    if (!result.rows[0]) {
      return res.status(401).json({ error: "Token inválido" });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error("Erro na autenticação:", error);
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
};