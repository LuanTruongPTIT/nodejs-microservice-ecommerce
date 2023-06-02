const express = require("express");
const app = express();
app.use(express.json());
const { PORT } = require("./config");
app.use("/", (req, res, next) => {
  return res.status(200).json({ msg: "Hello from Shopping" });
});

app.listen(PORT, () => {
  console.log("Shopping is listening on to Port 8803");
});
