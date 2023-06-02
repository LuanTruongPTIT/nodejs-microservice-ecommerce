"use strict";

const {
  product,
  clothing,
  electronic,
  funiture,
} = require("../database/models/product.model");

const { BadRequestError, ForbiddenError } = require("../core/error.response");
const {
  findAllDraftsForShop,
} = require("../database/repository/product-repository");
// define Factory class to create product

class ProductFactory {
  /* 
    type:'Clothing',
    payload:
  */
  static productRegistry = {};
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }
  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequestError("Invalid not type");
    return new productClass(payload).createProduct();
  }
  static async findAllDraftsForShop(
    { product_shop, limit = 50, skip = 0 },
    channel
  ) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip }, channel);
  }
  async SubscribeEvents(payload, channel) {
    const { event, data } = payload;

    eventManager.triggerEvent(event, data, channel);
  }
}

//define base product class

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_attributes,
    product_quantity,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
    this.product_quantity = product_quantity;
  }
  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}
// define sub-class for different product types clothing

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("create new Clothing error ");
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("create new Product error");
    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("create new Electronic error ");
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("create new Product error");
    return newProduct;
  }
}
class Funitures extends Product {
  async createProduct() {
    const newFuniture = await funiture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFuniture) throw new BadRequestError("create new Funitures error ");
    const newProduct = await super.createProduct(newFuniture._id);
    if (!newProduct) throw new BadRequestError("create new Product error");
    return newProduct;
  }
}
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Funitures", Funitures);

module.exports = ProductFactory;
