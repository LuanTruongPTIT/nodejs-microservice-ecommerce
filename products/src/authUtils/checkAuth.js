"use strict";

const Header = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};
const { findById } = require("../services/apiKey.service");
const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[Header.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    const objKey = await findById({ key });
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {}
};
module.exports = { apiKey };
