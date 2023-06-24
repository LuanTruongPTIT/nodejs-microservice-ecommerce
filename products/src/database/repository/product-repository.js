"use strict";
const {
  product,
  electronic,
  clothing,
  funiture,
} = require("../models/product.model");
const { SubscribeMessage } = require("../../utils/index");
const JSONCache = require("redis-json");
const redis_product = require("../connection.redis");
// let jsonCache = new JSONCache(redis_product.client, { predix: "product:" });

const getDraft = async ({ query, limit, skip }, product_shop) => {
  const key = `draft:true:${product_shop}`;
  // const responseProduct = await jsonCache.get(key, "draft:true");
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
const consumerCustomer = async (channel) => {};
// function all draft of shop
module.exports.findAllDraftsForShop = async (
  { query, limit, skip },
  channel,
  product_shop
) => {
  let products = await getDraft({ query, limit, skip }, product_shop);

  // const customer = await consumerCustomer(channel);
  // console.log(customer);
  const q = await SubscribeMessage(channel);
  let customer;
  await channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        customer = JSON.parse(msg.content);
        console.log(customer);
        // productDraftSHops.map((productDraftSHop) => {
        //   productDraftSHop.product_shop = {
        //     name: message.customer.name,
        //     email: message.customer.email,
        //   };
        //   return productDraftSHop;
        // })
      }
      return customer;
    },
    {
      noAck: true,
    }
  );
};
