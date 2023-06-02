const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const axios = require("axios");
const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "refreshtoken",
};
module.exports.authenticationV2 = async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];

  if (!userId) {
    throw new AuthFailureError("Invalid Request");
  }
  console.log(userId);
  await axios
    .get(`http://customer:8007/shop/keystore/${userId}`)
    .then((keyStore) => {
      console.log(keyStore.data);
      if (!keyStore.data) throw new NotFoundError("Not found keyStore");

      if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
          const refreshToken = req.headers[HEADER.REFRESHTOKEN];
          const decodeUser = jwt.verify(refreshToken, keyStore.privateKey);
          if (userId !== decodeUser.userId)
            throw new AuthFailureError("Invalid UserId");
          req.keyStore = keyStore.data;
          req.user = decode;
          req.refreshToken = refreshToken;
          return next();
        } catch (error) {
          throw error;
        }
      }
      const accessToken = req.headers[HEADER.AUTHORIZATION];
      if (!accessToken) throw new AuthFailureError("Invalid Request ");
      try {
        const decodeUser = jwt.verify(accessToken, keyStore.data.publicKey);
        if (userId !== decodeUser.userId) {
          throw new AuthFailureError("Invalid Userid");
        }
        req.keyStore = keyStore.data;
        req.user = decodeUser;
        return next();
      } catch (error) {
        throw error;
      }
    });
};
