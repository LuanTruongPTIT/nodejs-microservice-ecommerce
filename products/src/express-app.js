const express = require("express");
const cors = require("cors");
const { product } = require("./api");
const { createChannel } = require("./utils/index");
module.exports = async (app) => {
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  const channel = await createChannel();
  if (channel) {
    console.log("Connect thanh cong");
  }

  app.use(express.json());
  app.use(cors());
  product(app, channel);
};
