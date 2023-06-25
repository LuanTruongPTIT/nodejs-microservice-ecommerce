//Apply design strategy pattern
// const { findAllDraftsForShop } = require("./product-repository");
class EventStrategy {
  strategies = {
    "GET-USER": (data) => this.getUser(),
  };
  addStrategy = (name, strategy) => (this.strategies[name] = strategy);

  executeStrategy = (name, data) => this.strategies[name][data];
}

module.exports.SubscribeEvents = (payload) => {
  console.log("SubscribeEvents-handleMessage", payload);
  payload = JSON.parse(payload);
  const { event, data } = payload;
  let eventStrategy = new EventStrategy();
  eventStrategy.executeStrategy(event, data);
};

let registerEvent = new EventStrategy();
// registerEvent.addStrategy("GET-USER", (data) => this.getUser());
