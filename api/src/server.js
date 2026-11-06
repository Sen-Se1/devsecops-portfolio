const app = require("./app");

const PORT = Number(process.env.API_PORT || 4000);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Portfolio API listening on port ${PORT}`);
});