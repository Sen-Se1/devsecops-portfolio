const express = require("express");
const { profile } = require("../data");

const router = express.Router();

router.get("/profile", (_req, res) => {
  res.json(profile);
});

module.exports = router;