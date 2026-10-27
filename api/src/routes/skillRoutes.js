const express = require("express");
const { skills } = require("../data");

const router = express.Router();

router.get("/skills", (_req, res) => {
  res.json(skills);
});

module.exports = router;