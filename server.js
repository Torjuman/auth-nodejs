const express = require("express");

const app = express();
const PORT = 80;

app.get("/", (req, res) => {
  res.status(200).send("Hello World !");
});

app.listen(PORT, () => {
  console.log(`Server is Running at http://localhost:${PORT}`);
});
