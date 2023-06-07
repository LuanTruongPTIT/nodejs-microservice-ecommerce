const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";

// const shopSchema = new Schema({
//   name: {},
// });
const keyTokenchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "Shop" },
    publicKey: { type: String, require: true },
    privateKey: { type: String, require: true },
    refreshTokensUsed: { type: Array, default: [] },
    refreshToken: { type: String, require: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenchema);
