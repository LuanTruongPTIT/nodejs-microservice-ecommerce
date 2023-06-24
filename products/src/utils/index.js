const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const crypto = require("crypto");
const amqplib = require("amqplib");

const {
  PRODUCT_SERVICE,
  EXCHANGE_NAME,
  MSG_QUEUE_URL,
  QUEUE_NAME,
} = require("../config");
module.exports.GeneratePassword = async (password, salt) => {
  const passwords = await bcrypt.hash(password, salt);
  return passwords;
};
module.exports.GenerateApiKey = async () => {
  const apiKey = crypto.randomBytes(32).toString("hex");
  return apiKey;
};

module.exports.getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};
module.exports.createChannel = async () => {
  try {
    const connection = await amqplib.connect("amqp://rabbitmq:5672");
    const channel = await connection.createChannel();
    // channel.assertQueue(EXCHANGE_NAME, "direct", { durable: true });
    channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });

    return channel;
  } catch (error) {
    console.log(error);
  }
};
module.exports.PublishMessage = (channel, service, msg) => {
  channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
};
module.exports.SubscribeMessage = async (channel) => {
  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
  const q = await channel.assertQueue(QUEUE_NAME, { exclusive: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, PRODUCT_SERVICE);
  return q;
};
