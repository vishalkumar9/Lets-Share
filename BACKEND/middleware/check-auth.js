const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const user = require("../models/user");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      throw new Error("Authentication Failed!");
    }

    const decodedToken = jwt.verify(
      token,
      "somthing_private_which_i_dont_tell_to_anyone"
    );
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication Failed", 401);
    return next(error);
  }
};
