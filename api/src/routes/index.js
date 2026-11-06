const express = require("express");

const router = express.Router();

router.use(require("./healthRoutes"));
router.use(require("./profileRoutes"));
router.use(require("./projectRoutes"));
router.use(require("./skillRoutes"));
router.use(require("./contactRoutes"));

module.exports = router;