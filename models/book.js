const { ObjectId } = require("mongodb");
const { getDb } = require("../config/mongoConnection");

class Book {
  static getCollection() {
    return getDb().collection("books");
  }

  static async getBooks() {
    return await this.getCollection().find().toArray();
  }

  static async createBook(book) {
    return await this.getCollection().insertOne(book);
  }

  static async findBookById(id) {
    return await this.getCollection().findOne({ _id: new ObjectId(id) });
  }

  static async deleteById(id) {
    return await this.getCollection().deleteOne({ _id: new ObjectId(id) });
  }

  static async updateBookById(id, book) {
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: book,
    };

    return await this.getCollection().updateOne(filter, updateDoc);
  }
}

module.exports = Book;
