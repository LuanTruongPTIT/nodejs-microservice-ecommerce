const apiKeyModel = require("../database/models/apiKey.model");
const findById = async (key) => {
  const objKey = await apiKeyModel.findOne({ key }).lean();
  return objKey;
};
module.exports = {
  findById,
};
