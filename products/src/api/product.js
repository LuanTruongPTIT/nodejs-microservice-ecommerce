const ProductService = require("../services/product.service");
const { SuccessResponse } = require("../core/success.response");
const { authenticationV2 } = require("../authUtils/authUtils");
const { PublishMessage, SubscribeMessage } = require("../utils/index");
const { CUSTOMER_SERVICE } = require("../config");
module.exports = (app, channel) => {
  // const service = new ProductService();
  SubscribeMessage(channel);
  app.post(
    "/product/createproduct/",
    authenticationV2,
    async (req, res, next) => {
      new SuccessResponse({
        message: "Create new Product success",
        metadata: await ProductService.createProduct(req.body.product_type, {
          ...req.body,
          product_shop: req.user.userId,
        }),
      }).send(res);
    }
  );

  // findAllDraft
  app.get("/drafts/all/", authenticationV2, async (req, res, next) => {
    const data = {
      event: "FIND_USER",
      product_shop: req.user.userId,
    };
    await PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(data));
    new SuccessResponse({
      message: "Get all drafts success",
      metadata: await ProductService.findAllDraftsForShop(
        {
          product_shop: req.user.userId,
        },
        channel
      ),
    }).send(res);
  });
};
