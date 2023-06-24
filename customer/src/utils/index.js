const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const amqplib = require("amqplib");
const crypto = require("crypto");
const {
  MSG_QUEUE_URL,
  EXCHANGE_NAME,
  CUSTOMER_SERVICE,
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
module.exports.PublishMessage = async (channel, service, msg) => {
  await channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
};
module.exports.SubscribeMessage = async (channel, service) => {
  // await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
  const q = await channel.assertQueue(QUEUE_NAME, { exclusive: true });
  channel.bindQueue(q.queue, EXCHANGE_NAME, CUSTOMER_SERVICE);

  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
        service.SubscribeEvents(msg.content.toString(), channel);
      }
    },
    {
      noAck: true,
    }
  );
};
