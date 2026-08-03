import request from "supertest";
import app from "../../app.js";

describe("Health endpoint", () => {
  it("GET /health deve retornar 200 com status OK", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "OK");
    expect(response.body).toHaveProperty("timestamp");
  });
});
