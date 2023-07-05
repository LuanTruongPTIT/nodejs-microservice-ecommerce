const express = require("express");
const expressApp = require("./express-app");

const redis_product = require("./database/connection.redis");
const { changeDB } = require("./changeDB/changeStream");
const { PORT } = require("./config");
const instanceMongoDB = require("./database/connection");
const { countConnect, checkOverload } = require("./helpers/check.connect");
const { createIndexProduct } = require("./models/product.redis");
const StartServer = async () => {
  const app = express();
  await instanceMongoDB();
  countConnect();
  checkOverload();
  await redis_product.initalizeClient();
  await expressApp(app);
  // await redis_product.createIndexProduct();
  changeDB();
  app.use("/", (req, res, next) => {
    return res.status(200).json({ msg: "Hello from Product" });
  });

  app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.code = 404;
    next(error);
  });
  app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      status: "error",
      code: statusCode,
      stack: error.stack,
      message: error.message || " Internal Server error",
    });
  });
  app.listen(PORT, () => {
    console.log(`Product is listening on to Port ${PORT}`);
  });
};

StartServer();
