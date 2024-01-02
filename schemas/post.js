const Post = require("../models/post");

const typeDefs = `#graphql
type Address {
    street: String
    number: Int
}

type User {
    _id: ID
    username: String
    email: String
    password: String
    address: Address,
  },

type Post {  
    _id: ID
    userId: String
    title: String
    caption: String
    tags: [String]
    User: [User]
}

type Query {
    posts: [Post]
}
`;

const resolvers = {
  Query: {
    posts: async (_, __, contextValue) => {
      try {
        const user = await contextValue.authentication();

        console.log(user, "<<< user di resolver");
        const findPosts = await Post.getPosts(user.userId);

        console.log(findPosts, ">>>>>> findPosts");
        return findPosts;
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
