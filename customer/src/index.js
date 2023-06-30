const express = require("express");
const expressApp = require("./express-app");
const { changeDB } = require("./changeDB/changeStream");
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
  app.use("/", (req, res, next) => {
    return res.status(200).json({ msg: "Hello from Customer" });
  });
 

  app.listen(PORT, () => {
    console.log(`Customer is listening on to Port ${PORT}`);
  });
};

StartServer();
