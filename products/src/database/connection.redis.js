const redis = require("redis");
const { REDIS_HOST, REDIS_PORT } = require("../config");

let redisClient;
module.exports.connectRedis = async () => {
  if (!redisClient) {
    redisClient = redis.createClient({
      url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
    });
  }
  (async () => {
    await redisClient.connect();
  })();

  redisClient.on("ready", () => {
    console.log("Connected!");
  });

  redisClient.on("error", (err) => {
    console.log("Error in the Connection", err);
  });
  return redisClient;
};
