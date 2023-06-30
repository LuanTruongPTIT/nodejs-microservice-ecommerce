const { DB_URL } = require("../config");
const mongoose = require("mongoose");

//Ap dung Design Pattern -Singleton
class Database {
  constructor() {
    this.connect();
  }
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    console.log(DB_URL);
    mongoose
      .connect(DB_URL, {
        maxPoolSize: 100, //Mac dinh la 50 hoac 100
      })
      .then(() => {
        console.log("Connect MongoDB Success");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database(); // Database.instance de lay doi tuong ra
    }
    return Database.instance;
  }
}
const instanceMongoDB = Database.getInstance;
module.exports = instanceMongoDB;
