const redis = require("ioredis");
const { REDIS_HOST, REDIS_PORT } = require("../config");

class RedisWrapper {
  constructor() {
    this.client = new redis(REDIS_PORT, REDIS_HOST);
  }
  initalizeClient() {
    this.onConnect();
    this.onReconnecting();
    this.onEnd();
    this.onClose();
    this.onError();
  }
  onConnect() {
    this.client.on("connect", () => {
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
      console.log("Redis-Close to Redis");
    });
  }
  onError() {
    this.client.on("error", () => {
      console.log("Redis-Error error");
    });
  }
}
const redis_customer = new RedisWrapper();
module.exports = redis_customer;
