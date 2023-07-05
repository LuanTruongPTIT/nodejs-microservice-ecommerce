const instanceMongoDB = require("../database/connection");
const { product } = require("../models/product.model");
const mongoose = require("mongoose");

module.exports.changeDB = () => {
  product.watch().on("change", (data) => {
    console.log(data);
  });
};
