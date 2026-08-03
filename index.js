import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors"; // Adicione CORS

// Rotas
import authRoutes from "./routes/auth.js";
import booksRoutes from "./routes/books.js";

// Database
// Conectar ao banco
import db from "./database/conn.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas Públicas (SEM autenticação)
app.use("/api/auth", authRoutes);

// Rotas Privadas (COM autenticação)
app.use("/api/books", booksRoutes);

// Rota de saúde
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.listen(port, () => {
  console.log(`🚀 API rodando em http://localhost:${port}`);
});