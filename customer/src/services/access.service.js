"use strict";

const shopModel = require("../models/shop.model");
const CustomerRepository = require("../repository/customer-repository");
const keytokenModel = require("../models/keytoken.model");
const {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { CreateTokenPair, verifyJWT } = require("../authUtils/authUtils");
const { getInfoData } = require("../utils");
const { GeneratePassword, GenerateApiKey } = require("../utils/index");
const bcrypt = require("bcrypt");
const { eventManager } = require("./handleMessage.service");
const RoleShop = {
  SHOP: "SHOP",
  ADMIN: "ADMIN",
};
class AccessService {
  constructor() {
    this.repository = new CustomerRepository();
  }
  signUp = async ({ name, email, password }, res) => {
    //step1:check mail exist
    const holderShop = await this.repository.FindCustomer({ email });
    if (holderShop) {
      throw new BadRequestError("Error:Shop already exit");
    }
    const password_user = await GeneratePassword(password, 10);
    const newShop = await this.repository.createCustomer({
      name,
      email,
      password: password_user,
      role: RoleShop.SHOP,
    });
    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      const tokens = await CreateTokenPair(
        { userId: newShop.id, email },
        publicKey,
        privateKey
      );
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop.id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
      });

      if (!keyStore) {
        conflict(res, "publicKeyString error");
      }

      // const apiKey = await GenerateApiKey();

      // if (apiKey) {
      //   res.setHeader("x-api-key", apiKey);
      // }
      return {
        code: 201,
        metadata: {
          shopp: getInfoData({
            fileds: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };

  //login
  login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await this.repository.FindCustomer({ email });
    if (!foundShop) {
      throw new BadRequestError("Invalid shop");
    }
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError("Authentication error");
    }
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    const { _id: userId } = foundShop;
    const tokens = await CreateTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });
    return {
      shopp: getInfoData({
        fileds: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };
  logout = async ({ keyStore }) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);

    return delKey;
  };

  /*
     check this token use?
  */
  handleRefreshToken = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happen !! Please login ");
    }
    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("Shop not registered");
    }
    const foundShop = await this.repository.FindCustomer({ email });
    if (!foundShop) {
      throw new AuthFailureError("Shop not registered");
    }
    const tokens = await CreateTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );
    await keytokenModel.updateOne(
      { _id: keyStore._id },
      {
        $set: {
          refreshToken: tokens.refreshToken,
        },
        $addToSet: {
          refreshTokensUsed: refreshToken, //da duoc su dung
        },
      }
    );
    return {
      user: { userId, email },
      tokens,
    };
  };
  async SubscribeEvents(payload, channel) {
    const data = JSON.parse(payload);
    const { event, product_shop } = data;
    eventManager.triggerEvent(event, product_shop, channel);
  }
}

module.exports = AccessService;
