import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT_FRONTEND || 3000;
const API_URL = process.env.API_URL || "http://localhost:4000";

// Configurações
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// Armazenar token globalmente (em produção use sessions/cookies seguros)
let authToken = null;

// Armazenar ID do usuário globalmente (em produção use sessions/cookies seguros)
let userId = null;

// ========== ROTAS PÚBLICAS (SEM AUTENTICAÇÃO) ==========

// Página inicial de login/registro
app.get("/", (req, res) => {
  res.render("login.ejs", { error: null });
});

// Registro de novo usuário
app.get("/register", (req, res) => {
  res.render("register.ejs", { error: null });
});

// ========== ROTAS DE AUTENTICAÇÃO ==========

// Fazer login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password,
    });

    authToken = response.data.token;
    console.log("✅ Login realizado! Token salvo.");
    //console.log(`✅ Seu token de acesso: \n${authToken}`);
    userId = response.data.userId;
    // console.log(`ID user: ${userId}`);
    res.redirect("/dashboard");
  } catch (error) {
    console.error("❌ Erro no login:", error.response?.data || error.message);
    res.render("login.ejs", {
      error: error.response?.data?.error || "Erro no login",
    });
  }
});

// Registro de usuário
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, profileimage } = req.body;

    const response = await axios.post(`${API_URL}/api/auth/register`, {
      name,
      email,
      password,
      profileimage,
    });

    authToken = response.data.token;
    console.log("✅ Usuário registrado e logado!");
    userId = response.data.userId;

    res.redirect("/dashboard");
  } catch (error) {
    console.error(
      "❌ Erro no registro:",
      error.response?.data || error.message,
    );
    res.render("register.ejs", {
      error: error.response?.data?.error || "Erro no registro",
    });
  }
});

// Logout
app.post("/logout", (req, res) => {
  authToken = null;
  console.log("🔓 Logout realizado!");
  userId = null;
  res.redirect("/");
});

// ========== ROTAS PRIVADAS (COM AUTENTICAÇÃO) ==========
// Middleware para adicionar token automaticamente
const withAuth = async (axiosConfig) => {
  if (!authToken) {
    throw new Error("Usuário não autenticado. Faça login primeiro.");
  }

  return {
    ...axiosConfig,
    headers: {
      ...axiosConfig.headers,
      Authorization: `Bearer ${authToken}`,
    },
  };
};

// Dashboard principal (lista de livros)
app.get("/dashboard", async (req, res) => {
  try {
    if (!authToken && !userId) {
      return res.redirect("/");
    }

    const response = await axios.get(
      `${API_URL}/api/books`,
      await withAuth({}),
    );

    res.render("index.ejs", {
      books: response.data,
      userId: userId,
      isAuthenticated: true,
    });
  } catch (error) {
    console.error(
      "❌ Erro ao carregar dashboard:",
      error.response?.data || error.message,
    );

    if (error.response?.status === 401) {
      authToken = null;
      userId = null;
      return res.redirect("/");
    }

    res.render("error.ejs", {
      error: "Erro ao carregar livros. Tente novamente.",
    });
  }
});

// Nova anotação
app.get("/new", (req, res) => {
  if (!authToken && !userId) return res.redirect("/");
  res.render("modify.ejs", {
    heading: "Nova Anotação",
    submit: "Criar Anotação",
    book: null,
  });
});

// Editar anotação
app.get("/edit/:id", async (req, res) => {
  try {
    if (!authToken && !userId) return res.redirect("/");

    const response = await axios.get(
      `${API_URL}/api/books/${req.params.id}`,
      await withAuth({}),
    );

    res.render("modify.ejs", {
      heading: "Editar Anotação",
      submit: "Atualizar Anotação",
      book: response.data,
    });
  } catch (error) {
    console.error(
      "❌ Erro ao carregar livro:",
      error.response?.data || error.message,
    );
    res.render("error.ejs", {
      error: "Livro não encontrado",
    });
  }
});

// Acessar uma anotação específica
app.get("/book/:id", async (req, res) => {
  try {
    if (!authToken && !userId) return res.redirect("/");

    const response = await axios.get(
      `${API_URL}/api/books/${req.params.id}`,
      await withAuth({}),
    );

    res.render("book.ejs", {
      book: response.data,
      userId: userId,
      isAuthenticated: true,
    });
  } catch (error) {
    console.error(
      "❌ Erro ao carregar livro:",
      error.response?.data || error.message,
    );
    res.render("error.ejs", {
      error: "Livro não encontrado",
    });
  }
});

// ========== OPERAÇÕES CRUD (COM AUTENTICAÇÃO) ==========

// Criar nova anotação
app.post("/books", async (req, res) => {
  const bookPayload = { ...(req.body || {}) };
  if (userId) {
    bookPayload.author_id = userId;
  }

  const title =
    typeof bookPayload.title === "string" ? bookPayload.title.trim() : "";
  const recommendationText =
    typeof bookPayload.recommendation_text === "string"
      ? bookPayload.recommendation_text.trim()
      : "";

  if (!title) {
    return res.render("error.ejs", {
      error: "Título é obrigatório para criar a anotação",
    });
  }

  if (!recommendationText) {
    return res.render("error.ejs", {
      error: "Recomendação é obrigatória para criar a anotação",
    });
  }

  bookPayload.title = title;
  bookPayload.recommendation_text = recommendationText;

  try {
    await axios.post(`${API_URL}/api/books`, bookPayload, await withAuth({}));
    res.redirect("/dashboard");
  } catch (error) {
    console.error(
      "❌ Erro ao criar livro:",
      error.response?.data || error.message,
    );
    res.render("error.ejs", {
      error: error.response?.data?.error || "Erro ao criar anotação",
    });
  }
});

// Atualizar anotação
app.post("/books/:id/update", async (req, res) => {
  const bookPayload = { ...(req.body || {}) };
  if (userId) {
    bookPayload.author_id = userId;
  }

  const title =
    typeof bookPayload.title === "string" ? bookPayload.title.trim() : "";
  const recommendationText =
    typeof bookPayload.recommendation_text === "string"
      ? bookPayload.recommendation_text.trim()
      : "";

  if (!title) {
    return res.render("error.ejs", {
      error: "Título é obrigatório para atualizar a anotação",
    });
  }

  if (!recommendationText) {
    return res.render("error.ejs", {
      error: "Recomendação é obrigatória para atualizar a anotação",
    });
  }

  bookPayload.title = title;
  bookPayload.recommendation_text = recommendationText;

  try {
    await axios.put(
      `${API_URL}/api/books/${req.params.id}`,
      bookPayload,
      await withAuth({}),
    );
    res.redirect("/dashboard");
  } catch (error) {
    console.error(
      "❌ Erro ao atualizar:",
      error.response?.data || error.message,
    );
    res.render("error.ejs", {
      error: error.response?.data?.error || "Erro ao atualizar anotação",
    });
  }
});

// Deletar anotação
app.post("/books/:id/delete", async (req, res) => {
  try {
    await axios.delete(
      `${API_URL}/api/books/${req.params.id}`,
      await withAuth({}),
    );
    res.redirect("/dashboard");
  } catch (error) {
    console.error("❌ Erro ao deletar:", error.response?.data || error.message);
    res.render("error.ejs", {
      error: error.response?.data?.error || "Erro ao deletar anotação",
    });
  }
});

// Perfil do usuário
app.get("/profile", async (req, res) => {
  try {
    if (!authToken && !userId) return res.redirect("/");

    const response = await axios.get(
      `${API_URL}/api/auth/me`,
      await withAuth({}),
    );

    res.render("profile.ejs", { user: response.data });
  } catch (error) {
    console.error("❌ Erro ao carregar perfil:", error.response?.data);
    res.redirect("/");
  }
});

// 404
app.use((req, res) => {
  res.status(404).render("error.ejs", {
    error: "Página não encontrada",
  });
});

app.listen(port, () => {
  console.log(`🌐 Frontend Server: http://localhost:${port}`);
  console.log(`🔗 Backend API: ${API_URL}`);
  console.log(
    `⚙️ API_URL source: ${process.env.API_URL ? "process.env.API_URL" : "fallback localhost"}`,
  );
});
