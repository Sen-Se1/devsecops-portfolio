const { z } = require("zod");

const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100, "Name must not exceed 100 characters"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .max(254, "Email must not exceed 254 characters")
      .email("Invalid email address"),

    message: z
      .string()
      .trim()
      .min(1, "Message is required")
      .max(5000, "Message must not exceed 5000 characters"),
  })
  .strict();

module.exports = contactSchema;