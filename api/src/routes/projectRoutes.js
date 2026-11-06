const express = require("express");
const { projects } = require("../data");

const router = express.Router();

router.get("/projects", (_req, res) => {
  res.json(projects);
});

module.exports = router;