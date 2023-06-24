const redis = require("redis");
const { REDIS_HOST, REDIS_PORT } = require("../config");

class RedisWrapper {
  constructor() {
    // this.client = new redis(REDIS_PORT, REDIS_HOST);
    this.client = redis.createClient({
      url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
    });
  }
  initalizeClient() {
    this.onConnect();
    this.onReconnecting();
    this.onEnd();
    this.onClose();
    this.onError();
  }
  async onConnect() {
    await this.client.connect("connect", () => {
      console.log("Redis-Connect to Redis");
    });
  }
  onReconnecting() {
    this.client.on("reconnecting", () => {
      console.log("Redis-Reconnecting to Redis");
    });
  }
  onEnd() {
    this.client.on("end", () => {
      console.log("Redis-End to Redis");
    });
  }
  onClose() {
    this.client.on("close", () => {
      console.log("Redis-End to Redis");
    });
  }
  onError() {
    this.client.on("error", () => {
      console.log("Redis-Redis error");
    });
  }
}
const redis_products = new RedisWrapper();

module.exports = redis_products;
