const arrAuthors = [
  {
    name: "dadank konelo",
    age: 98,
    rating: 5.5,
  },
  {
    name: "budi trondol",
    age: 16,
    rating: 9,
  },
];

const typeDefs = `#graphql

type Author {
  name: String
  age: Int
  rating: Float
}

# The "Query" type is special: it lists all of the available queries that
# clients can execute, along with the return type for each. In this
# case, the "books" query returns an array of zero or more Books (defined above).
type Query {
  authors: [Author]
}
`;

const resolvers = {
  Query: {
    authors: function (_, __, contextValue) {
      return arrAuthors;
    },
  },
};

module.exports = { typeDefs, resolvers };
