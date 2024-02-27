const { getDb } = require("../config/mongoConnection");
const Book = require("../models/book");
const redis = require("../config/redisConfig");

const typeDefs = `#graphql

type Book {
  _id: ID!
  title: String
  author: String
  stock: Int
}


# The "Query" type is special: it lists all of the available queries that
# clients can execute, along with the return type for each. In this
# case, the "books" query returns an array of zero or more Books (defined above).
type Query {
  books: [Book]
  bookById(_id: ID!): Book
}

input BookInput {
  title: String!
  author: String!
  stock: Int
}

input UpdateBookInput {
  _id: ID!
  author: String
  title: String
}

type Mutation {
  createBook(bookInput: BookInput!): Book
  deleteBook(_id: ID!): String
  updateBookById(updateInput: UpdateBookInput!): String
}
`;

const resolvers = {
  Query: {
    books: async (_, __, contextValue) => {
      // const user = await contextValue.authentication();
      const booksCache = await redis.get("books:all");
      if (booksCache) {
        console.log(booksCache, "<<<< oi oi");
        return JSON.parse(booksCache);
      }

      const findBooks = await Book.getBooks();

      await redis.set("books:all", JSON.stringify(findBooks));
      return findBooks;
    },
    bookById: async (_, args) => {
      const findBook = await Book.findBookById(args._id);
      return findBook;
    },
  },

  Mutation: {
    createBook: async (_, args) => {
      let newBook = { ...args.bookInput };

      await Book.createBook(newBook);

      //? it really return the new created document to previous variable
      console.log(newBook, "after create");
      await redis.del("books:all");

      return newBook;
    },

    deleteBook: async (_, args) => {
      const deleteById = await Book.deleteById(args._id);
      console.log(deleteById, "<<<");

      return `Success delete id ${args._id}`;
    },

    updateBookById: async (_, args) => {
      let data = { ...args.updateInput };
      delete data._id;

      await Book.updateBookById(args.updateInput._id, data);
      return `Success update id ${args.updateInput._id}`;
    },
  },
};

module.exports = { typeDefs, resolvers };
