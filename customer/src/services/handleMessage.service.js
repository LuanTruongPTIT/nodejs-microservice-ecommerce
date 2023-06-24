"use strict";
const CustomerRepository = require("../database/repository/customer-repository");
const { PublishMessage } = require("../utils/index");
const { PRODUCT_SERIVCE } = require("../config");
const { BadRequestError } = require("../core/error.response");
class findUserById {
  async handleEvent(data, channel) {
    const userId = data;
    console.log(userId);
    const customer = await CustomerRepository.FindCustomerById({ _id: userId });
    const datas = {
      event: "Get_User",
      customer: customer,
    };
    console.log(datas);
    PublishMessage(channel, PRODUCT_SERIVCE, JSON.stringify(datas));
  }
}

class EventManager {
  static eventHandlers = new Map();

  registerEventHandler(event, handler) {
    EventManager.eventHandlers.set(event, handler);
  }

  triggerEvent(event, data, channel) {
    const handler = EventManager.eventHandlers.get(event);

    if (!handler) {
      throw new BadRequestError("Invalid handler");
    }
    handler.handleEvent(data, channel);
  }
}
const eventManager = new EventManager();

eventManager.registerEventHandler("FIND_USER", new findUserById());

module.exports = { eventManager };
