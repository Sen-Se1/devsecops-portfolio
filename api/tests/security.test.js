const request = require("supertest");
const app = require("../src/app");

describe("API security tests", () => {
  // 1. Vérifier le comportement face à une route inexistante
  test("GET /api/unknown should return 404", async () => {
    const response = await request(app).get("/api/unknown");

    expect(response.status).toBe(404);
  });

  // 2. Vérifier le rejet d'un JSON malformé
  test("POST with malformed JSON should return 400", async () => {
    const response = await request(app)
      .post("/api/health")
      .set("Content-Type", "application/json")
      .send('{"name":');

    expect(response.status).toBe(400);
  });

  // 3. Vérifier qu'une tentative d'injection ne provoque pas de plantage
  test("SQL injection-like input should not crash the API", async () => {
    const payload = "' OR '1'='1";

    const response = await request(app)
      .get("/api/health")
      .query({ input: payload });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.text).not.toMatch(/SQL syntax|database error/i);
  });

  // 4. Vérifier le comportement face à une entrée très longue
  test("Very long query parameter should not crash the API", async () => {
    const payload = "A".repeat(5000);

    const response = await request(app)
      .get("/api/health")
      .query({ input: payload });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  // 5. Vérifier la limite de taille du corps JSON
  test("Oversized JSON body should return 413", async () => {
    const payload = { data: "A".repeat(15000) };

    const response = await request(app)
      .post("/api/health")
      .send(payload);

    expect(response.status).toBe(413);
  });
});