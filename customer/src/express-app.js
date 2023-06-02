const express = require("express");
const cors = require("cors");
const { customer } = require("./api");
const { createChannel } = require("./utils");
module.exports = async (app) => {
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  const channel = await createChannel();
  app.use(express.json());
  app.use(cors());
  customer(app, channel);
};
