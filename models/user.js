const { ObjectId } = require("mongodb");
const { getDb } = require("../config/mongoConnection");

class User {
  static async findByEmail(email) {
    return await getDb().collection("users").findOne({ email });
  }

  static async findById(id) {
    return await getDb()
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
  }
}

module.exports = User;
