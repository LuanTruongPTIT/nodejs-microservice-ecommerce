"use strict";
const {
  product,
  electronic,
  clothing,
  funiture,
} = require("../models/product.model");
const { SubscribeMessage } = require("../utils/index");
const redis_product = require("../database/connection.redis");
const event = require("../constants/event");
const { BadRequestError } = require("../core/error.response");
const { Types } = require("mongoose");

// Check JSON Object
const checkObjectJson = async () => {};
const getDraft = async ({ query, limit, skip }, product_shop) => {
  const key = `product:${product_shop}`;
  const responseProduct = await redis_product.client.json.get(key, {
    path: ".draft:true",
  });

  let products;
  if (responseProduct) {
    return responseProduct````;
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
const getPublish = async ({ query, limit, skip }) => {
  const { product_shop, isPublished } = query;
  console.log(`publish:${isPublished}`);
  const key = `product:${product_shop}`;
  console.log(key);
  const responseObject = await redis_product.client.json.get(key);
  const responseProduct =
    responseObject && responseObject[`publish:${isPublished}`];
  // const responseProduct = await redis_product.client.json.get(key, {
  //   path: ".publish:true",
  // });
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
    console.log(products);
    // save product in redis
    // await redis_product.client.json.set(key, "$", {
    //   "publish:true": products,
    // });allalal
    if (responseObject) {
      responseObject["publish:true"] = products;
      await redis_product.client.json.set(key, "$", responseObject);
      return products;
    } else {
      await redis_product.client.json.set(key, "$", {
        "publish:true": products,
      });
      return products;
    }
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

module.exports.publishProductByShop = async (product_id, product_shop) => {
  const product_shop_id = product_shop;

  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop_id.product_shop),
    _id: new Types.ObjectId(product_id),
  });
  console.log(foundShop);
  if (!foundShop)
    throw new BadRequestError("Not found shop when publish product shop");
  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const { modifedCount } = await foundShop.save();
  return modifedCount;
};
module.exports.findAllPublishForShop = async (
  { query, limit, skip },
  channel
) => {
  let products = await getPublish({ query, limit, skip });
  console.log(products);
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
