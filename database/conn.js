import pkg from "pg";
import dotenv from "dotenv";
import net from 'net';

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
  connectionTimeoutMillis: 5000, // Timeout de conexão: 5s
  acquireTimeoutMillis: 60000, // Timeout para pegar conexão do pool: 60s
  // POOLING INTELIGENTE
  allowExitOnIdle: false, // Não permitir saída em idle

  // O TRUQUE DEFINITIVO: Força o driver do Postgres (pg) a usar apenas IPv4 (família 4)
  options: '-c client_encoding=utf8',

  // Adiciona a configuração de família diretamente no cliente pg
  createConnection: (cb) => {
    const client = net.connect({
      host: process.env.NODE_ENV === "production"
      ? "db.czywqgcbkzwsoydxbhww.supabase.co" 
      : pool.options.host,
      port: 5432,
      family: 4 // <--- FORÇA IPV4 PURAMENTE NO SOCKET
    }, () => {
      cb(null, client);
    });
    client.on('error', cb);
    return client;
  }    
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
