const arrBooks = [
  {
    id: 1,
    title: "The Awakening",
    author: "Kate Chopin",
    imageUrl: "www.gambar-gambir.com",
  },
  {
    id: 2,
    title: "City of Glass",
    author: "Paul Auster",
    imageUrl: "www.gambar-gambir.com",
  },
];

const typeDefs = `#graphql

type Book {
  id: ID!
  title: String
  author: String
  imageUrl: String
}


# The "Query" type is special: it lists all of the available queries that
# clients can execute, along with the return type for each. In this
# case, the "books" query returns an array of zero or more Books (defined above).
type Query {
  books: [Book]
  bookById(id: ID!): Book
}

type Mutation {
  createBook(title: String!, author: String!, imageUrl: String!): Book
}
`;

const resolvers = {
  Query: {
    books: async (_, __, contextValue) => {
      const user = contextValue.authentication();
      console.log(user, "<<<< USER");

      return arrBooks;
    },
    bookById: (_, args) => {
      console.log(args, "<<<< ini args sob");

      return arrBooks.find((el) => el.id == args.id);
    },
  },

  Mutation: {
    createBook: (_, args) => {
      // console.log({ args });
      const { title, author, imageUrl } = args;
      const newBook = { ...args, id: arrBooks.length + 1 };

      arrBooks.push(newBook);
      return newBook;
    },
  },
};

module.exports = { typeDefs, resolvers };
