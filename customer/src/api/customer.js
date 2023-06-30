const AccessService = require("../services/access.service");
// const { apiKey } = require("../authUtils/checkAuth");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
const { authenticationV2 } = require("../authUtils/authUtils");
const { findByUserId } = require("../services/keyToken.service");
const { BadRequestError } = require("../core/error.response");
const { SubscribeMessage } = require("../utils");
const { asyncHandler } = require("../helpers/asyncHandler");
module.exports = (app, channel) => {
  const service = new AccessService();
  SubscribeMessage(channel, service);
  app.post(
    "/shop/signup",
    asyncHandler(async (req, res, next) => {
      new CREATED({
        message: "Sign success",
        metadata: await service.signUp(req.body),
      }).send(res);
    })
  );

  //login router
  app.get(
    "/shop/login",
    authenticationV2,
    asyncHandler(async (req, res, next) => {
      new SuccessResponse({
        message: "Login success",
        metadata: await service.login(req.body),
      }).send(res);
    })
  );

  //log out
  app.get(
    "/shop/logout",
    authenticationV2,
    asyncHandler(async (req, res, next) => {
      new SuccessResponse({
        message: "Logout success",
        metada: await service.logout(req.keyStore),
      }).send(res);
    })
  );

  app.post(
    "/shop/handlerRefreshToken",
    authenticationV2,
    async (req, res, next) => {
      new SuccessResponse({
        message: "Get token success",
        metada: await service.handleRefreshToken({
          refreshToken: req.refreshToken,
          user: req.user,
          keyStore: req.keyStore,
        }),
      }).send(res);
    }
  );
  app.get("/shop/keystore/:userId", async (req, res, next) => {
    console.log("Param", req.params.userId);
    const userId = await findByUserId({ userId: req.params.userId });
    if (!userId) throw new BadRequestError("Invalid userId when call api");
    res.send(userId);
  });
};
