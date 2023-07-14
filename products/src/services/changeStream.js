const { product } = require("../models/product.model");
const redisPubSubService = require("../services/redisPubSub.product.service");

class ChangeDB {
  publishChangeData() {
    product
      .watch([], { fullDocument: "updateLookup" })
      .on("change", async (result) => {
        console.log(result);
        let data;
        if (result) {
          data = {
            id: result.documentKey._id.toString(),
            field_update:
              result.updateDescription.updatedFields !== null
                ? result.updateDescription.updatedFields
                : {},
            removeField:
              result.updateDescription.removeFields !== null
                ? result.updateDescription.removeFields
                : {},
            product_shop: result.fullDocument.product_shop,
          };
        }
        await redisPubSubService.publish(
          "update_data_product",
          JSON.stringify(data)
        );
      });
  }
}
const changeDB = new ChangeDB();
module.exports = changeDB;
