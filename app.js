const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const {
  typeDefs: bookTypeDefs,
  resolvers: bookResolvers,
} = require("./schemas/book");

const {
  typeDefs: authorTypeDefs,
  resolvers: authorResolvers,
} = require("./schemas/author");

const server = new ApolloServer({
  typeDefs: [bookTypeDefs, authorTypeDefs],
  resolvers: [authorResolvers, bookResolvers],
});

startStandaloneServer(server, {
  listen: { port: 3000 },
  context: ({ req }) => {
    return {
      authentication: function () {
        let token = req.headers.authorization;
        if (!token) {
          throw new GraphQLError("please provide token", {
            extensions: {
              code: "NOT_AUTHENTENTICATED",
              extensions: {
                code: 401,
              },
            },
          });
        }

        return { user: { id: 1 } };
      },
    };
  },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});

// async function startServer(params) {
//   const { url } = await startStandaloneServer(server, {
//     listen: { port: 3000 },
//   });

//   console.log(`🚀  Server ready at: ${url}`);
// }

// startServer();
