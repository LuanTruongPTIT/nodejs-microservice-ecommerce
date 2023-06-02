const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "refreshtoken",
};
module.exports.CreateTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = jwt.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
    });
    console.log(refreshToken);
    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error("error verify:", err);
      } else {
        console.log("decode verify:", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};
module.exports.authentication = asyncHandler(async (req, res, next) => {
  /* 
  1-Check user missing??
  2-get accessToken 
  3-verifyToken 
  4-check user in dbs
  5- check keyStore with this userId 
  6 -OK all =>return next()                                                                                                                                                                                                                                                                                                    
  */

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid Request");
  }
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found keyStore");

  const accessToken = req.headers[Headers.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request ");
  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid Userid");
    }
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});
module.exports.verifyJWT = async (token, keySecret) => {
  return await jwt.verify(token, keySecret);
};

module.exports.authenticationV2 = async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];

  console.log(userId);
  if (!userId) {
    throw new AuthFailureError("Invalid Request");
  }
  const keyStore = await findByUserId(userId);

  if (!keyStore) throw new NotFoundError("Not found keyStore");

  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = jwt.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId)
        throw new AuthFailureError("Invalid UserId");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request ");
  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid Userid");
    }
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
};
