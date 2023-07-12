const redisPubSubService = require("./redisPubSub.product.service");

class SubscribeMessage {
  constructor() {
    redisPubSubService.subscribe("update_data_product", (message, channel) => {
      SubscribeMessage.syncDataInRedis(message, channel);
    });
  }
  static syncDataInRedis(data) {
    console.log("data", data);
  }
}
// const subscribeMessage = new SubscribeMessage();
// module.exports = subscribeMessage;
module.exports = new SubscribeMessage();
