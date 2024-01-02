const jwt = require("jsonwebtoken");
const SECRET = "rahasia";

const createToken = (payload) => jwt.sign(payload, SECRET);
const verifyToken = (token) => jwt.verify(token, SECRET);

module.exports = { createToken, verifyToken };
