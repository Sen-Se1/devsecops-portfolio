const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes");
const ApiError = require("./utils/ApiError");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running",
  });
});

app.use("/api", apiRoutes);

app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Portfolio API listening on port ${PORT}`);
});
