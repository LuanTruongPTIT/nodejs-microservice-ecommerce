const index_Product = {
  // product_draft: "idx:product:draft"
  product_draft: {
    name_index: "idx:product:draft",
    // path: "$.draft.product_name",
    path: {
      path_product_name: "$.draft.product_name",
      path_product_brand: "$.draft.product_brand",
    },
  },
};
module.exports = { index_Product };
