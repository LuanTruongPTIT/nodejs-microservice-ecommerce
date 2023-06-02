"use strict";
const {
  product,
  electronic,
  clothing,
  funiture,
} = require("../models/product.model");
const { SubscribeMessage } = require("../../utils2/index");
module.exports.findAllDraftsForShop = async (
  { query, limit, skip },
  channel
) => {
  // return await product
  //   .find(query)
  //   .populate("product_shop", "name email -_id")
  //   .sort({ updateAt: -1 })
  //   .skip(skip)
  //   .limit(limit)
  //   .lean()\\\\\\\\\\\\\\\\\\\\\\

  //   .exec();
  const products = await product
    .find(query)
    .sort({ update: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  const q = await SubscribeMessage(channel);
  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
      }
    },
    {
      noAck: true,
    }
  );
};
