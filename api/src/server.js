const express = require("express");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express API server is running on port ${PORT}`);
});
