const express = require("express");
const expressApp = require("./express-app");

const redis_customer = require("./database/connection.redis");

const { PORT } = require("./config");
const instanceMongoDB = require("./database/connection");
const { countConnect, checkOverload } = require("./helpers/check.connect");

const StartServer = async () => {
  const app = express();
  await instanceMongoDB();
  countConnect();
  checkOverload();
  redis_customer.initalizeClient();
  await expressApp(app);
  // app.use((req, res, next) => {
  //   const error = new Error("Not Found");
  //   error.code = 404;
  //   next(error);
  // });
  // app.use((error, req, res, next) => {
  //   const statusCode = error.status || 500;
  //   return res.status(statusCode).json({
  //     status: "error",
  //     code: statusCode,
  //     stack: error.stack,
  //     message: error.message || " Internal Server error",
  //   });
  // });
  app.use("/", (req, res, next) => {
    return res.status(200).json({ msg: "Hello from Customer" });
  });

  app.listen(PORT, () => {
    console.log(`Customer is listening on to Port ${PORT}`);
  });
};

StartServer();
