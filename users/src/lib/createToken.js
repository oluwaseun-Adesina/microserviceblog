const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const secret = process.env.APP_SECRET;
const maxAge = 30 * 60 * 60 * 60;
const  createToken = (id) => {
  return jwt.sign({ id }, secret, {
    expiresIn: maxAge,
  });
};

module.exports = createToken()