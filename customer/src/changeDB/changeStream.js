const instanceMongoDB = require("../database/connection");
const shopModel = require("../models/shop.model");
const mongoose = require("mongoose");
const keyTokenchema = require("../models/keytoken.model");
module.exports.changeDB = () => {
  shopModel.watch().on("change", (data) => {
    console.log(data);
  });
};
