const { GraphQLError } = require("graphql");
const { verifyToken } = require("../helpers/jwt");
const User = require("../models/user");

async function authentication(req) {
  try {
    if (!req.headers.authorization) {
      throw new GraphQLError("please provide token", {
        extensions: { code: "INVALID_TOKEN" },
      });
    }

    let token = req.headers.authorization.split(" ")[1];
    const decode = verifyToken(token);

    console.log(decode, "<<< decode");

    const findUser = await User.findById(decode.userId);

    if (!findUser) {
      throw new GraphQLError("invalid token", {
        extensions: { code: "INVALID_TOKEN" },
      });
    }

    console.log(findUser);

    return { userId: findUser._id };
  } catch (error) {
    throw error;
  }
}

module.exports = authentication;
