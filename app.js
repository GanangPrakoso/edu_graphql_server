const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const {
  typeDefs: bookTypeDefs,
  resolvers: bookResolvers,
} = require("./schemas/book");

const { connect } = require("./config/mongoConnection");

const server = new ApolloServer({
  typeDefs: [bookTypeDefs],
  resolvers: [bookResolvers],
});

async function startServer() {
  try {
    await connect();

    const { url } = await startStandaloneServer(server, {
      listen: { port: 3000 },
      context: async ({ req }) => {
        return {
          authentication: async function () {
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
    });

    console.log(`🚀  Server ready at: ${url}`);
  } catch (error) {
    console.log(error);
  }
}

startServer();
