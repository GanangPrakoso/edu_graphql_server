const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const authentication = require("./middlewares/authentication");

const {
  typeDefs: bookTypeDefs,
  resolvers: bookResolvers,
} = require("./schemas/book");

const {
  typeDefs: postTypeDefs,
  resolvers: postResolvers,
} = require("./schemas/post");

const {
  typeDefs: userTypeDefs,
  resolvers: userResolvers,
} = require("./schemas/user");

const {
  typeDefs: orderTypeDefs,
  resolvers: orderResolvers,
} = require("./schemas/order");

const { connect } = require("./config/mongoConnection");

const server = new ApolloServer({
  typeDefs: [bookTypeDefs, postTypeDefs, userTypeDefs, orderTypeDefs],
  resolvers: [bookResolvers, postResolvers, userResolvers, orderResolvers],
});

async function startServer() {
  try {
    const db = await connect();

    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
      context: async ({ req, res }) => {
        return {
          db,
          authentication: async () => await authentication(req),
        };
      },
    });

    console.log(`🚀  Server ready at: ${url}`);
  } catch (error) {
    console.log(error);
  }
}

startServer();
