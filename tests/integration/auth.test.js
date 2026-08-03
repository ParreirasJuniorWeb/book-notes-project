import request from "supertest";
import app from "../../app.js";
import { cleanDatabase } from "../helpers/testDb.js";

describe("Auth integration", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it("POST /api/auth/register deve criar usuário e retornar token", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Teste User",
      email: "teste@example.com",
      password: "123456",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Usuário criado com sucesso",
    );
    expect(response.body).toHaveProperty("userId");
    expect(response.body).toHaveProperty("token");
  });

  it("POST /api/auth/register deve impedir e-mail duplicado", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Teste User",
      email: "duplicado@example.com",
      password: "123456",
    });

    const response = await request(app).post("/api/auth/register").send({
      name: "Outro User",
      email: "duplicado@example.com",
      password: "abcdef",
    });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error", "E-mail já está em uso");
  });

  it("POST /api/auth/login deve autenticar usuário válido", async () => {
    const email = "login@example.com";
    const password = "123456";

    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email,
      password,
    });

    const response = await request(app).post("/api/auth/login").send({
      email,
      password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Login realizado com sucesso",
    );
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("userId");
  });

  it("POST /api/auth/login deve falhar com senha inválida", async () => {
    const email = "wrongpass@example.com";

    await request(app).post("/api/auth/register").send({
      name: "Wrong Pass",
      email,
      password: "123456",
    });

    const response = await request(app).post("/api/auth/login").send({
      email,
      password: "senha-errada",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Credenciais inválidas");
  });

  it("GET /api/auth/me deve retornar 401 sem token", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "error",
      "Token de acesso não fornecido",
    );
  });

  it("GET /api/auth/me deve retornar dados com token válido", async () => {
    const email = "me@example.com";
    const password = "123456";

    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Me User",
        email,
        password,
      });

    const token = registerResponse.body.token;

    const meResponse = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body).toHaveProperty("id");
    expect(meResponse.body).toHaveProperty("name", "Me User");
    expect(meResponse.body).toHaveProperty("email", email);
  });
});
