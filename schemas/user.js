const { GraphQLError } = require("graphql");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { createToken } = require("../helpers/jwt");

const typeDefs = `#graphql
type Token {
    access_token: String
}

type Mutation {
    login(email: String!, password: String!): Token
}
`;

const resolvers = {
  Mutation: {
    login: async (_, args) => {
      const { email, password } = args;
      const findUser = await User.findByEmail(email);

      if (!findUser) {
        throw new GraphQLError("invalid email/password", {
          extensions: { code: "INVALID_EMAIL/PASSWORD" },
        });
      }

      const validatePassword = bcrypt.compareSync(password, findUser.password);

      if (!validatePassword) {
        throw new GraphQLError("invalid email/password", {
          extensions: { code: "INVALID_EMAIL/PASSWORD" },
        });
      }

      const access_token = createToken({
        userId: findUser._id,
      });

      return { access_token };
    },
  },
};

module.exports = { typeDefs, resolvers };
