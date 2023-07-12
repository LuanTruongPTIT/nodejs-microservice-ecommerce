const redis = require("redis");
const { REDIS_HOST, REDIS_PORT } = require("../config");

class RedisPubSubService {
  constructor() {
    this.subscriber = redis.createClient({
      url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
    });

    this.publisher = redis.createClient({
      url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
    });
    this.connect();
  }
  connect() {
    this.subscriber.connect();
    this.publisher.connect();
  }
  async publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          console.log("reply", reply);
          resolve(reply);
        }
      });
    });
    // await this.publisher.publish(channel, message);
  }
  subscribe(channel, callback) {
    this.subscriber.subscribe(channel, callback);
    this.subscriber.on("message", (subscriberChannel, message) => {
      if (channel === subscriberChannel) {
        callback(channel, message);
      }
    });
    // this.subscriber.subscribe(channel, callback);
  }
}

const redisPubSubService = new RedisPubSubService();
module.exports = redisPubSubService;
