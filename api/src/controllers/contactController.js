const contactSchema = require("../schemas/contactSchema");
const ApiError = require("../utils/ApiError");
const prisma = require("../db");

async function submitContact(req, res, next) {
  const result = contactSchema.safeParse(req.body);

  if (!result.success) {
    const details = result.error.issues.map(({ path, message }) => ({
      field: path.join("."),
      message,
    }));

    return next(new ApiError(400, "Validation failed", details));
  }

  const { name, email, message } = result.data;

  try {
    const savedMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Contact message received successfully.",
      data: {
        ...savedMessage,
        id: savedMessage.id.toString(),
      },
    });
  } catch (err) {
    console.error("Failed to save contact message:", err);
    return next(new ApiError(500, "Unable to save contact message"));
  }
}

module.exports = { submitContact };
