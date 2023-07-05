// const { SchemaFieldTypes } = require("redis");
// const redis_product = require("../database/connection.redis");

// module.exports.createIndexProduct = async () => {
//   try {
//     await redis_product.client.ft.create(
//       "idx:product",
//       {
//         "$.draft[*].product_name": {
//           type: SchemaFieldTypes.TEXT,
//           SORTABLE: true,
//         },
//         "$.draft[*].product_description": {
//           type: SchemaFieldTypes.TEXT,
//           AS: "product_des",
//         },
//         "$.draft[*].product_type": {
//           type: SchemaFieldTypes.TAG,
//           AS: "product_type",
//         },
//         "$.draft[*].product_shop": {
//           type: SchemaFieldTypes.TEXT,
//           AS: "product_shop",
//         },
//         "$.draft[*].product_attributes.brand": {
//           type: SchemaFieldTypes.TEXT,
//           SORTABLE: true,
//         },
//         "$.draft[*].product_attributes.material": {
//           type: SchemaFieldTypes.TEXT,
//           SORTABLE: true,
//         },
//       },
//       {
//         "$.publish[*].product_name": {
//           type: SchemaFieldTypes.TEXT,
//           SORTABLE: true,
//         },
//         "$.publish[*].product_description": {
//           type: SchemaFieldTypes.TEXT,
//           AS: "product_des",
//         },
//         "$.publish[*].product_type": {
//           type: SchemaFieldTypes.TAG,
//           AS: "product_type",
//         },
//         "$.publish[*].product_shop": {
//           type: SchemaFieldTypes.TEXT,
//           AS: "product_shop",
//         },
//         "$.publish[*].product_attributes.brand": {
//           type: SchemaFieldTypes.TEXT,
//           SORTABLE: true,
//         },
//         "$.publish[*].product_attributes.material": {
//           type: SchemaFieldTypes.TEXT,
//           SORTABLE: true,
//         },
//       },
//       {
//         ON: "JSON",
//         PREFIX: "key:product",
//       }
//     );
//   } catch (error) {
//     if (error.message === "Index already exists") {
//       console.log(error);
//       console.log("Index exists already, skipped creation");
//     } else {
//       throw error;
//     }
//   }
// };
