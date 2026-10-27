const contactSchema = require("../schemas/contactSchema");
const ApiError = require("../utils/ApiError");

function submitContact(req, res, next) {
  const result = contactSchema.safeParse(req.body);

  if (!result.success) {
    const details = result.error.issues.map(({ path, message }) => ({
      field: path.join("."),
      message,
    }));

    return next(new ApiError(400, "Validation failed", details));
  }

  // TODO: Persist the contact message or send an email.

  return res.status(201).json({
    success: true,
    message: "Contact message received successfully.",
  });
}

module.exports = { submitContact };