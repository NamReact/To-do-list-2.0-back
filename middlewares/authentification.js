const User = require("../models/user-model");

authentification = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const user = await User.findOne({
        token: req.headers.authorization.replace("Bearer ", "")
      });
      if (!user) {
        return res.status(401).json("Unauthorized");
      }
      req.user = user;
      return next();
    }
    return res.status(400).json("Bad request");
  } catch (error) {
    return res.status(400).json("Bad request");
  }
};

module.exports = authentification;
