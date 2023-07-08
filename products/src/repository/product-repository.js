"use strict";
const {
  product,
  electronic,
  clothing,
  funiture,
} = require("../models/product.model");
const { SubscribeMessage } = require("../utils/index");
// const redis_product = require("../database/connection.redis");
const client = require("../database/connection.redis");
const event = require("../constants/event");
const { BadRequestError } = require("../core/error.response");
const { Types } = require("mongoose");
const { KeyProductOfRedis } = require("../constants/key.product.redis");
const events = require("events");
// Check JSON Object
const eventEmitter = new events.EventEmitter();

const addProductRedis = async (key, object, products, keyProperty) => {
  if (object) {
    object[keyProperty] = products;
    await client.json.set(key, "$", object);
    return products;
  } else {
    let newObj = {};
    newObj[keyProperty] = products;
    await client.json.set(key, "$", newObj);
    return products;
  }
};
const getDraft = async ({ query, limit, skip }, product_shop) => {
  const key = `key:product:${product_shop}`;
  // const responseProduct = await redis_product.client.json.get(key, {
  //   path: ".draft:true",
  // });
  const responseObject = await client.json.get(key);
  const responseProduct =
    responseObject && responseObject[KeyProductOfRedis.IsDraft_Product];
  let products;
  if (responseProduct) {
    console.log("responseProduct", responseProduct);
    return responseProduct;
  } else {
    products = await product
      .find(query)
      .sort({ update: -1 })
      .skip({ update: -1 })
      .limit(limit)
      .lean();
    if (!products) {
      throw new BadRequestError("Not found Product Draft");
    }
    // save product in redis
    const draft = KeyProductOfRedis.IsDraft_Product;
    const result = await addProductRedis(key, responseObject, products, draft);
    return result;
  }
};
const getPublish = async ({ query, limit, skip }) => {
  const { product_shop } = query;

  const key = `key:product:${product_shop}`;
  const responseObject = await client.json.get(key);
  const responseProduct =
    responseObject && responseObject[KeyProductOfRedis.IsPublish_Product];
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

    if (!products) {
      throw new BadRequestError("Not found Product Publish");
    }

    const publish = KeyProductOfRedis.IsPublish_Product;

    const result = addProductRedis(key, responseObject, products, publish);
    return result;
  }
};
const consumerCustomer = async (channel) => {
  const q = await SubscribeMessage(channel);

  await channel.consume(
    q.queue,
    async (msg) => {
      const content = JSON.parse(msg.content.toString());
      if (content.event === event.getUserID) {
        eventEmitter.emit("message", {
          name: content.customer.name,
          email: content.customer.email,
        });
      }
    },
    {
      noAck: true,
    }
  );
};
// function all draft of shop
module.exports.findAllDraftsForShop = async (
  { query, limit, skip },
  channel,
  product_shop
) => {
  let products = await getDraft({ query, limit, skip }, product_shop);
  eventEmitter.on("message", (data) => {
    const { name, email } = data;
    products.map((product) => {
      product.product_shop = {
        name,
        email,
      };
      return product;
    });
  });

  await consumerCustomer(channel);

  return products;
};

module.exports.publishProductByShop = async (product_id, product_shop) => {
  const product_shop_id = product_shop;

  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop_id.product_shop),
    _id: new Types.ObjectId(product_id),
  });

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
  eventEmitter.on("message", (data) => {
    const { name, email } = data;
    products.map((product) => {
      product.product_shop = {
        name,
        email,
      };
      return product;
    });
  });

  await consumerCustomer(channel);
  return products;
};
const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
};
