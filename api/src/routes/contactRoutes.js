const express = require("express");

const { submitContact } = require("../controllers/contactController");
const contactRateLimiter = require("../middleware/contactRateLimiter");

const router = express.Router();

router.post("/contact", contactRateLimiter, submitContact);

module.exports = router;