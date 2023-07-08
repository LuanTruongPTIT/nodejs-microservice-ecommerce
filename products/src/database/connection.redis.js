const { createClient, SchemaFieldTypes } = require("redis");
const { REDIS_HOST, REDIS_PORT } = require("../config");
const { promisify } = require("util");
const { index_Product } = require("../constants/index.key.redis");
const { KeyProductOfRedis } = require("../constants/key.product.redis");
const client = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});
client.on("error", (err) => console.log("Redis disconnect"));

const checkIndexExists = async (indexName) => {
  try {
    await client.ft.info(indexName);
    return true;
  } catch (error) {
    return false;
  }
};
const createIndex = async (indexName, fields, options) => {
  const indexExists = await checkIndexExists(indexName);
  if (!indexExists) {
    await client.ft.create(indexName, fields, options);
  }
};
const updateIndex = async (indexName, fields, path, options) => {
  const indexExists = await checkIndexExists(indexName);
  if (indexExists) {
    const index_E = await client.ft.info(indexName);
    if (index_E.attributes[0].identifier !== path)
      await client.ft.alter(indexName, fields, options);
  }
};
// create index product
const createIndexProductDraft = async () => {
  const indexName = index_Product.product_draft.name_index;
  const path = index_Product.product_draft.path.path_product_name;
  console.log(indexName, path, "create");
  let fields = {};
  fields[path] = {
    type: SchemaFieldTypes.TEXT,
    SORTABLE: true,
  };
  const options = {
    ON: "JSON",
    PREFIX: KeyProductOfRedis.IsDraft_Product,
  };
  await createIndex(indexName, fields, options);
};
// update index product brand
const updateIndexProductDraftBrand = async () => {
  const indexName = index_Product.product_draft.name_index;
  const path = index_Product.product_draft.path.path_product_brand;

  let fields = {};
  fields[path] = {
    type: SchemaFieldTypes.TEXT,
    SORTABLE: true,
  };
  const options = {
    ON: "JSON",
    PREFIX: KeyProductOfRedis.IsDraft_Product,
  };
  await updateIndex(indexName, fields, path, options);
};
module.exports = {
  client,
  checkIndexExists,
  createIndexProductDraft,
  updateIndexProductDraftBrand,
};
