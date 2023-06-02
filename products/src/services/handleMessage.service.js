"use strict";
const { PRODUCT_SERIVCE } = require("../config");
const {
  findAllDraftsForShop,
} = require("../database/repository/product-repository");
class getUserByIdToGetDraft {
  static async handleEvent(data, channel) {
    return data;
  }
}

class EventManager {
  static eventHandlers = new Map();

  static registerEventHandler(event, handler) {
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
eventManager.registerEventHandler("Get_User", new getUserByIdToGetDraft());

module.exports = { eventManager };
