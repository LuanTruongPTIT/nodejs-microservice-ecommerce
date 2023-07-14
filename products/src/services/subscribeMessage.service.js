const redisPubSubService = require("./redisPubSub.product.service");
const { client } = require("../database/connection.redis");
class SubscribeMessage {
  constructor() {
    redisPubSubService.subscribe("update_data_product", (message, channel) => {
      SubscribeMessage.syncDataInRedis(message, channel);
    });
  }
  static async syncDataInRedis(result) {
    const data = JSON.parse(result);
    const key = `key:product:${data.product_shop}`;
    const data_change = await client.json.get(key);
    let keys = Object.keys(data_change);
    let keyofData;
    for (let i = 0; i < keys.length; i++) {
      console.log(keys[i]);
      keyofData = keys[i];
      for (let j = 0; j < data_change[keyofData].length; j++) {
        if (data_change[keyofData][j]._id === data.id) {
          let fiedlUpdates = data.field_update;
          for (let fiedld in fiedlUpdates) {
            data_change[keyofData][j][fiedld] = fiedlUpdates[fiedld];
          }
        }
      }
    }
    await client.json.set(key, `$.${keyofData}`, JSON.stringify(data_change));
  }
}
// const subscribeMessage = new SubscribeMessage();
// module.exports = subscribeMessage;
module.exports = new SubscribeMessage();
