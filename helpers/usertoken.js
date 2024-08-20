const jwt = require("jsonwebtoken");
const userDetails = require("../model/regModel");

const jwtToken = (user, expiredIn) => {
  return jwt.sign(user, process.env.SECRET_TOKEN_PASS, {
        expiresIn: expiredIn
     })
};

module.exports = jwtToken;