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

  //error handling
  try {
    customer(app, channel);
  } catch (error) {
    console.logg("lalalal");
  }

  app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.code = 404;
    next(error);
  });
  app.use((error, req, res, next) => {
    console.log("lalal");
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      error: "Da co loi",
      status: "error",
      code: statusCode,
      stack: error.stack,
      message: error.message || " Internal Server error",
    });
  });
};
