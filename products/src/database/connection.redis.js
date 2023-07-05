const redis = require("redis");
const { REDIS_HOST, REDIS_PORT } = require("../config");
const { SchemaFieldTypes } = require("redis");
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
    this.createIndexProductDraft();
    this.createIndexProductPublish();
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

  async createIndexProductDraft() {
    try {
      await this.client.ft.create("idx:product:draft", {
        "$.draft[*].product_name": {
          type: SchemaFieldTypes.TEXT,
          SORTABLE: true,
        },
        "$.draft[*].product_description": {
          type: SchemaFieldTypes.TEXT,
          AS: "product_des",
        },
        "$.draft[*].product_type": {
          type: SchemaFieldTypes.TAG,
          AS: "product_type",
        },
        "$.draft[*].product_shop": {
          type: SchemaFieldTypes.TEXT,
          AS: "product_shop",
        },
        "$.draft[*].product_attributes.brand": {
          type: SchemaFieldTypes.TEXT,
          SORTABLE: true,
        },
        "$.draft[*].product_attributes.material": {
          type: SchemaFieldTypes.TEXT,
          SORTABLE: true,
        },
      });
    } catch (error) {
      if (error.message === "Index already exists") {
        console.log(error);
        console.log("Index exists already, skipped creation");
      } else {
        throw error;
      }
    }
  }
  async createIndexProductPublish() {
    try {
      await this.client.ft.create(
        "idx:product:publish",
        {
          "$.publish[*].product_name": {
            type: SchemaFieldTypes.TEXT,
            SORTABLE: true,
          },
          "$.publish[*].product_description": {
            type: SchemaFieldTypes.TEXT,
            AS: "product_des",
          },
          "$.publish[*].product_type": {
            type: SchemaFieldTypes.TAG,
            AS: "product_type",
          },
          "$.publish[*].product_shop": {
            type: SchemaFieldTypes.TEXT,
            AS: "product_shop",
          },
          "$.publish[*].product_attributes.brand": {
            type: SchemaFieldTypes.TEXT,
            SORTABLE: true,
          },
          "$.publish[*].product_attributes.material": {
            type: SchemaFieldTypes.TEXT,
            SORTABLE: true,
          },
        },
        {
          ON: "JSON",
          PREFIX: "key:product",
        }
      );
    } catch (error) {
      if (error.message === "Index already exists") {
        console.log(error);
        console.log("Index exists already, skipped creation");
      } else {
        throw error;
      }
    }
  }
  static getInstance() {
    if (!RedisWrapper.instance) {
      RedisWrapper.instance = new RedisWrapper(); // Database.instance de lay doi tuong ra
    }
    return RedisWrapper.instance;
  }
}
// const redis_products = new RedisWrapper();
const redis_products = RedisWrapper.getInstance();

module.exports = redis_products;
