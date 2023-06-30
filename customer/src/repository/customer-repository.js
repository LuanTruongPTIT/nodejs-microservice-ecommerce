const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
class CustomerRepository {
  async FindCustomer({ email }) {
    const existingCustomer = await shopModel.findOne({ email }).lean();
    return existingCustomer;
  }
  async createCustomer({ name, email, password, role }) {
    const newCustomer = new shopModel({
      name,
      email,
      password,
      role,
    });
    const savedCustomer = await newCustomer.save();
    return savedCustomer;
  }
  static async FindCustomerById(userId) {
    const customer = await shopModel.findOne(userId);
    return customer;
  }
}
module.exports = CustomerRepository;
