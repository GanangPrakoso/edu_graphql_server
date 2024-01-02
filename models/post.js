const { getDb } = require("../config/mongoConnection");

class Post {
  static getCollection() {
    return getDb().collection("posts");
  }

  static async getPosts(id) {
    // const findPosts = await this.getCollection().find({ userId: id }).toArray();
    const findPosts = await this.getCollection()
      .aggregate([
        { $match: { userId: id } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "User",
          },
        },
        { $sort: { title: -1 } },
      ])
      .toArray();
    return findPosts;
  }
}

module.exports = Post;
