"use strict";
const {
  product,
  electronic,
  clothing,
  funiture,
} = require("../models/product.model");
const { SubscribeMessage } = require("../../utils/index");
const redis_product = require("../connection.redis");
const event = require("../../constants/event");
const { BadRequestError } = require("../../core/error.response");
const getDraft = async ({ query, limit, skip }, product_shop) => {
  const key = `draft:true:${product_shop}`;

  const responseProduct = await redis_product.client.json.get(key, {
    path: ".draft:true",
  });

  let products;
  if (responseProduct) {
    return responseProduct;
  } else {
    products = await product
      .find(query)
      .sort({ update: -1 })
      .skip({ update: -1 })
      .limit(limit)
      .lean();

    // save product in redis
    await redis_product.client.json.set(key, "$", {
      "draft:true": products,
    });
    return products;
  }
};
const consumerCustomer = async (channel) => {
  const q = await SubscribeMessage(channel);
  let message;
  return new Promise((resolve, reject) => {
    channel.consume(
      q.queue,
      (msg) => {
        if (msg.content.toString().event === event.getUserID) {
          message = JSON.parse(msg.content).customer;
          resolve({
            name: message.name,
            email: message.email,
          });
        }
      },
      {
        noAck: true,
      }
    );
  }).catch((error) => {
    throw new BadRequestError("Not information user");
  });
};
// function all draft of shop
module.exports.findAllDraftsForShop = async (
  { query, limit, skip },
  channel,
  product_shop
) => {
  let products = await getDraft({ query, limit, skip }, product_shop);
  const customer = await consumerCustomer(channel);
  const { name, email } = customer;
  products.map((product) => {
    product.product_shop = {
      name,
      email,
    };
    return product;
  });
  return products;
};
