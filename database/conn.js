import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.POSTGRESQL_USER || "postgres",
  host: process.env.POSTGRESQL_HOST || "localhost",
  database: process.env.POSTGRESQL_DATABASE || "booknotes",
  password: process.env.POSTGRESQL_PASSWORD,
  port: parseInt(process.env.POSTGRESQL_PORT) || 5432,
  // OTIMIZAÇÕES DE PERFORMANCE
  max: 20, // Máximo de conexões simultâneas
  min: 2, // Mínimo de conexões ociosas
  idleTimeoutMillis: 30000, // Fechar conexões ociosas após 30s
  connectionTimeoutMillis: 2000, // Timeout de conexão: 2s
  acquireTimeoutMillis: 60000, // Timeout para pegar conexão do pool: 60s
  // POOLING INTELIGENTE
  allowExitOnIdle: false, // Não permitir saída em idle
  // SSL (para produção)
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

pool.on("error", (err) => {
  console.error("Erro inesperado no banco:", err.message);
});

async function query(text, params, retries = 3) {
  const start = Date.now();

  try {
    const result = await pool.query(text, params);

    console.log("Query executada:", {
      text,
      duration: `${Date.now() - start}ms`,
      rows: result.rowCount,
    });

    return result;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retry (${retries})...`);
      return query(text, params, retries - 1);
    }

    console.error("Erro no banco:", error.message);
    throw error;
  }
}

async function close() {
  await pool.end();
}

export default { query, close };
