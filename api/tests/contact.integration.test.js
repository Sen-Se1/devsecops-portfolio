const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/db");

describe("Integration: API -> PostgreSQL", () => {
  let createdMessageId;

  afterEach(async () => {
    if (createdMessageId !== undefined) {
      await prisma.contactMessage.deleteMany({
        where: { id: createdMessageId },
      });

      createdMessageId = undefined;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("POST /api/contact saves a valid message in PostgreSQL", async () => {
    const payload = {
      name: "Integration Test",
      email: `integration-${Date.now()}@example.com`,
      message: "Message created by an automated integration test.",
    };

    const response = await request(app)
      .post("/api/contact")
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBeDefined();
    expect(typeof response.body.data.id).toBe("string");

    createdMessageId = BigInt(response.body.data.id);

    const savedMessage = await prisma.contactMessage.findUnique({
      where: { id: createdMessageId },
    });

    expect(savedMessage).not.toBeNull();
    expect(savedMessage.name).toBe(payload.name);
    expect(savedMessage.email).toBe(payload.email);
    expect(savedMessage.message).toBe(payload.message);
  });

  test("POST /api/contact rejects invalid email without inserting a row", async () => {
    const payload = {
      name: "Invalid Integration Test",
      email: "not-an-email",
      message: "This message must not be saved.",
    };

    const response = await request(app)
      .post("/api/contact")
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);

    const savedMessage = await prisma.contactMessage.findFirst({
      where: { email: payload.email },
    });

    expect(savedMessage).toBeNull();
  });
});

