const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const apiRoutes = require("./routes");
const ApiError = require("./utils/ApiError");
const errorHandler = require("./middleware/errorHandler");

// nosemgrep: javascript.express.security.audit.express-check-csurf-middleware-usage.express-check-csurf-middleware-usage
// Stateless JSON API: no cookies or sessions, CORS credentials disabled, so CSRF does not apply.
const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: false,
  }),
);

app.use(helmet());
app.use(express.json({ limit: "10kb" }));

app.use("/api", apiRoutes);

app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

app.use(errorHandler);

module.exports = app;
