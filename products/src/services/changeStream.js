const { product } = require("../models/product.model");
const redisPubSubService = require("../services/redisPubSub.product.service");

class ChangeDB {
  publishChangeData() {
    product.watch().on("change", async (data) => {
      console.log(data);
      await redisPubSubService.publish(
        "update_data_product",
        JSON.stringify(data.updateDescription)
      );
    });
  }
}
const changeDB = new ChangeDB();
module.exports = changeDB;
